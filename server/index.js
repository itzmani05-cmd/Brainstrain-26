import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { ObjectId } from "mongodb";
import { getDb } from "./db.js";
import { readFileSync } from "fs";
import { issueToken, requireAdmin, requireFullAdmin } from "./auth.js";
import { sendRegistrationReceivedEmail, sendApprovalEmail, sendReminderEmail } from "./email.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DEFAULT_REGISTRATION_FEE = 189;
const EVENTS = JSON.parse(readFileSync(path.join(__dirname, "../src/data/events.json"), "utf8"));
const EVENT_SLUGS = new Set(EVENTS.map((e) => e.slug));

async function nextParticipantId(db) {
  const doc = await db
    .collection("counters")
    .findOneAndUpdate(
      { _id: "participantId" },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" }
    );
  const seq = doc?.seq ?? doc?.value?.seq;
  return `BS26${String(seq).padStart(3, "0")}`;
}

app.get("/api/registration-fee", async (req, res) => {
  try {
    const db = await getDb();
    const setting = await db.collection("settings").findOne({ _id: "registrationFee" });
    res.json({ amount: setting?.amount ?? DEFAULT_REGISTRATION_FEE });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load registration fee" });
  }
});

app.get("/api/registration-status", async (req, res) => {
  try {
    const db = await getDb();
    const setting = await db.collection("settings").findOne({ _id: "registrationOpen" });
    res.json({ open: setting?.open ?? true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load registration status" });
  }
});

app.put("/api/admin/registration-status", requireAdmin, requireFullAdmin, async (req, res) => {
  const { open } = req.body || {};
  if (typeof open !== "boolean") {
    return res.status(400).json({ error: "open must be a boolean" });
  }

  try {
    const db = await getDb();
    await db
      .collection("settings")
      .updateOne({ _id: "registrationOpen" }, { $set: { open } }, { upsert: true });
    res.json({ ok: true, open });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update registration status" });
  }
});

// Results store participant IDs; this resolves each to {id, name, collegeName}
// (name/collegeName null if the ID doesn't match a registration) for display.
async function resolvePlacements(db, doc) {
  const ids = [doc?.winner, doc?.runnerUp, doc?.thirdPlace].filter(Boolean);
  const byId = new Map();
  if (ids.length) {
    const matches = await db
      .collection("registrations")
      .find({ participantId: { $in: ids } }, { projection: { participantId: 1, name: 1, collegeName: 1 } })
      .toArray();
    matches.forEach((m) => byId.set(m.participantId, m));
  }

  const toPlacement = (id) => {
    if (!id) return null;
    const match = byId.get(id);
    return { id, name: match?.name || null, collegeName: match?.collegeName || null };
  };

  return {
    winner: toPlacement(doc?.winner),
    runnerUp: toPlacement(doc?.runnerUp),
    thirdPlace: toPlacement(doc?.thirdPlace),
  };
}

app.get("/api/events/:eventSlug/result", async (req, res) => {
  const { eventSlug } = req.params;
  if (!EVENT_SLUGS.has(eventSlug)) {
    return res.status(404).json({ error: "Unknown event" });
  }

  try {
    const db = await getDb();
    const doc = await db.collection("results").findOne({ _id: eventSlug });
    res.json(await resolvePlacements(db, doc));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load result" });
  }
});

app.put("/api/admin/registration-fee", requireAdmin, requireFullAdmin, async (req, res) => {
  try {
    const { amount } = req.body || {};
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "amount must be a positive number" });
    }

    const db = await getDb();
    await db
      .collection("settings")
      .updateOne({ _id: "registrationFee" }, { $set: { amount } }, { upsert: true });

    res.json({ ok: true, amount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update registration fee" });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      collegeName,
      collegeCity,
      referralCode,
      attendingDrama,
      dramaLeaderName,
      dramaCollegeName,
      joinedWhatsapp,
      timestamp,
      transactionId,
    } = req.body || {};

    if (
      !name ||
      !email ||
      !phone ||
      !collegeName ||
      !collegeCity ||
      !timestamp ||
      !transactionId
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (attendingDrama && (!dramaLeaderName || !dramaCollegeName)) {
      return res.status(400).json({ error: "Drama team details are required when attending drama" });
    }

    const db = await getDb();
    const statusSetting = await db.collection("settings").findOne({ _id: "registrationOpen" });
    if (statusSetting?.open === false) {
      return res
        .status(403)
        .json({ error: "Online registration is closed. Please register on the spot at the venue." });
    }

    const now = new Date();
    const feeSetting = await db.collection("settings").findOne({ _id: "registrationFee" });
    const amount = feeSetting?.amount ?? DEFAULT_REGISTRATION_FEE;
    const referral = (referralCode || "").trim();

    const result = await db.collection("registrations").insertOne({
      name,
      email,
      phone,
      collegeName,
      collegeCity,
      referralCode: referral,
      referralCount: 0,
      attendingDrama: !!attendingDrama,
      dramaLeaderName: attendingDrama ? dramaLeaderName : "",
      dramaCollegeName: attendingDrama ? dramaCollegeName : "",
      joinedWhatsapp: !!joinedWhatsapp,
      timestamp,
      transactionId,
      amount,
      step1CompletedAt: now,
      step2CompletedAt: now,
      paymentVerified: false,
      createdAt: now,
    });

    if (referral) {
      await db
        .collection("registrations")
        .updateOne({ participantId: referral }, { $inc: { referralCount: 1 } });
    }

    const emailResult = await sendRegistrationReceivedEmail({ name, email, transactionId });
    await db.collection("registrations").updateOne(
      { _id: result.insertedId },
      {
        $set: {
          registrationEmailSent: emailResult.sent,
          registrationEmailError: emailResult.error,
        },
      }
    );

    res.json({ ok: true, id: result.insertedId, emailSent: emailResult.sent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save registration" });
  }
});

// Walk-in registration entered by the admin at the venue — payment (cash) was
// already collected, so it's saved pre-verified with a participant ID issued
// immediately, skipping the pending/verify step.
app.post("/api/admin/registrations/manual", requireAdmin, requireFullAdmin, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      collegeName,
      collegeCity,
      referralCode,
      attendingDrama,
      dramaLeaderName,
      dramaCollegeName,
    } = req.body || {};

    if (!name || !email || !phone || !collegeName || !collegeCity) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (attendingDrama && (!dramaLeaderName || !dramaCollegeName)) {
      return res.status(400).json({ error: "Drama team details are required when attending drama" });
    }

    const db = await getDb();
    const now = new Date();
    const feeSetting = await db.collection("settings").findOne({ _id: "registrationFee" });
    const amount = feeSetting?.amount ?? DEFAULT_REGISTRATION_FEE;
    const referral = (referralCode || "").trim();
    const participantId = await nextParticipantId(db);

    const result = await db.collection("registrations").insertOne({
      name,
      email,
      phone,
      collegeName,
      collegeCity,
      referralCode: referral,
      referralCount: 0,
      attendingDrama: !!attendingDrama,
      dramaLeaderName: attendingDrama ? dramaLeaderName : "",
      dramaCollegeName: attendingDrama ? dramaCollegeName : "",
      joinedWhatsapp: true,
      timestamp: now.toISOString(),
      transactionId: "ON-SPOT",
      amount,
      step1CompletedAt: now,
      step2CompletedAt: now,
      paymentVerified: true,
      participantId,
      registeredOnSpot: true,
      createdAt: now,
    });

    if (referral) {
      await db
        .collection("registrations")
        .updateOne({ participantId: referral }, { $inc: { referralCount: 1 } });
    }

    const emailResult = await sendApprovalEmail({ name, email, participantId });
    await db.collection("registrations").updateOne(
      { _id: result.insertedId },
      {
        $set: {
          approvalEmailSent: emailResult.sent,
          approvalEmailError: emailResult.error,
        },
      }
    );

    res.json({ ok: true, id: result.insertedId, participantId, emailSent: emailResult.sent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save registration" });
  }
});

app.post("/api/admin/login", (req, res) => {
  const { password } = req.body || {};
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: "Admin password not configured" });
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Incorrect password" });
  }
  res.json({ token: issueToken() });
});

app.get("/api/admin/registrations", requireAdmin, requireFullAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const registrations = await db
      .collection("registrations")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json({ registrations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load registrations" });
  }
});

// Scoped view for a coordinator pass (or the full admin): only verified
// registrants, with only the fields needed to check people in at the door.
app.get("/api/admin/events/:eventSlug/registrations", requireAdmin, async (req, res) => {
  const { eventSlug } = req.params;
  if (req.admin?.eventSlug && req.admin.eventSlug !== eventSlug) {
    return res.status(403).json({ error: "This pass is not valid for this event" });
  }
  if (!EVENT_SLUGS.has(eventSlug)) {
    return res.status(404).json({ error: "Unknown event" });
  }

  try {
    const db = await getDb();
    const registrations = await db
      .collection("registrations")
      .find(
        { paymentVerified: true },
        {
          projection: {
            name: 1,
            email: 1,
            phone: 1,
            collegeName: 1,
            participantId: 1,
            attendance: 1,
            advanced: 1,
          },
        }
      )
      .sort({ createdAt: -1 })
      .toArray();
    res.json({ registrations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load registrations" });
  }
});

// Set placements for an event — usable by the full admin or that event's
// scoped coordinator pass.
app.put("/api/admin/events/:eventSlug/result", requireAdmin, async (req, res) => {
  const { eventSlug } = req.params;
  if (req.admin?.eventSlug && req.admin.eventSlug !== eventSlug) {
    return res.status(403).json({ error: "This pass is not valid for this event" });
  }
  if (!EVENT_SLUGS.has(eventSlug)) {
    return res.status(404).json({ error: "Unknown event" });
  }

  const { winner, runnerUp, thirdPlace } = req.body || {};
  if (
    [winner, runnerUp, thirdPlace].some((v) => v != null && typeof v !== "string")
  ) {
    return res.status(400).json({ error: "winner, runnerUp, and thirdPlace must be participant IDs" });
  }

  const placements = {
    winner: (winner || "").trim().toUpperCase(),
    runnerUp: (runnerUp || "").trim().toUpperCase(),
    thirdPlace: (thirdPlace || "").trim().toUpperCase(),
  };

  try {
    const db = await getDb();

    const ids = [...new Set(Object.values(placements).filter(Boolean))];
    if (ids.length) {
      const matches = await db
        .collection("registrations")
        .find({ participantId: { $in: ids } }, { projection: { participantId: 1 } })
        .toArray();
      const found = new Set(matches.map((m) => m.participantId));
      const invalid = ids.filter((id) => !found.has(id));
      if (invalid.length) {
        return res.status(400).json({ error: `Unknown participant ID(s): ${invalid.join(", ")}` });
      }
    }

    await db.collection("results").updateOne(
      { _id: eventSlug },
      { $set: { ...placements, updatedAt: new Date() } },
      { upsert: true }
    );
    res.json(await resolvePlacements(db, placements));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save result" });
  }
});

// Full admin generates a scoped login link for an event's coordinator.
app.post("/api/admin/event-pass", requireAdmin, requireFullAdmin, (req, res) => {
  const { eventSlug } = req.body || {};
  if (!eventSlug || !EVENT_SLUGS.has(eventSlug)) {
    return res.status(400).json({ error: "Unknown event" });
  }
  res.json({ token: issueToken({ eventSlug }) });
});

app.patch("/api/admin/registrations/:id", requireAdmin, requireFullAdmin, async (req, res) => {
  try {
    const { paymentVerified } = req.body || {};
    if (typeof paymentVerified !== "boolean") {
      return res.status(400).json({ error: "paymentVerified must be a boolean" });
    }

    const db = await getDb();
    const _id = new ObjectId(req.params.id);
    const update = { $set: { paymentVerified } };

    const existing = await db.collection("registrations").findOne({ _id });
    const newlyVerified = paymentVerified && !existing?.paymentVerified;

    if (paymentVerified && existing && !existing.participantId) {
      update.$set.participantId = await nextParticipantId(db);
    }

    await db.collection("registrations").updateOne({ _id }, update);
    let updated = await db.collection("registrations").findOne({ _id });

    let approvalEmail = null;
    if (newlyVerified && updated) {
      approvalEmail = await sendApprovalEmail(updated);
      await db.collection("registrations").updateOne(
        { _id },
        {
          $set: {
            approvalEmailSent: approvalEmail.sent,
            approvalEmailError: approvalEmail.error,
          },
        }
      );
      updated = await db.collection("registrations").findOne({ _id });
    }

    res.json({
      ok: true,
      participantId: updated?.participantId ?? null,
      emailSent: approvalEmail ? approvalEmail.sent : null,
      emailError: approvalEmail ? approvalEmail.error : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update registration" });
  }
});

app.patch("/api/admin/registrations/:id/attendance", requireAdmin, async (req, res) => {
  try {
    const { eventSlug, present } = req.body || {};
    if (!eventSlug || typeof present !== "boolean") {
      return res.status(400).json({ error: "eventSlug and present are required" });
    }
    if (req.admin?.eventSlug && req.admin.eventSlug !== eventSlug) {
      return res.status(403).json({ error: "This pass is not valid for this event" });
    }

    const db = await getDb();
    await db
      .collection("registrations")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { [`attendance.${eventSlug}`]: present } }
      );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update attendance" });
  }
});

app.patch("/api/admin/registrations/:id/advanced", requireAdmin, async (req, res) => {
  try {
    const { eventSlug, advanced } = req.body || {};
    if (!eventSlug || typeof advanced !== "boolean") {
      return res.status(400).json({ error: "eventSlug and advanced are required" });
    }
    if (req.admin?.eventSlug && req.admin.eventSlug !== eventSlug) {
      return res.status(403).json({ error: "This pass is not valid for this event" });
    }

    const db = await getDb();
    await db
      .collection("registrations")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { [`advanced.${eventSlug}`]: advanced } }
      );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update round status" });
  }
});

// Consolidated college leaderboard: 1pt participation (attended), 2pt advanced
// to next round, 5pt event winner, 3pt event runner-up.
app.get("/api/college-points", requireAdmin, requireFullAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const [registrations, resultDocs] = await Promise.all([
      db
        .collection("registrations")
        .find(
          { paymentVerified: true },
          { projection: { participantId: 1, collegeName: 1, attendance: 1, advanced: 1 } }
        )
        .toArray(),
      db.collection("results").find({}).toArray(),
    ]);

    const collegeByParticipantId = new Map(
      registrations.filter((r) => r.participantId).map((r) => [r.participantId, r.collegeName])
    );

    const totals = new Map(); // collegeName -> { points, participations, advances, wins, runnerUps }
    function add(collegeName, field, points) {
      if (!collegeName) return;
      if (!totals.has(collegeName)) {
        totals.set(collegeName, { points: 0, participations: 0, advances: 0, wins: 0, runnerUps: 0 });
      }
      const t = totals.get(collegeName);
      t.points += points;
      t[field] += 1;
    }

    for (const reg of registrations) {
      for (const slug of EVENT_SLUGS) {
        if (reg.attendance?.[slug]) add(reg.collegeName, "participations", 1);
        if (reg.advanced?.[slug]) add(reg.collegeName, "advances", 2);
      }
    }

    for (const doc of resultDocs) {
      if (doc.winner) add(collegeByParticipantId.get(doc.winner), "wins", 5);
      if (doc.runnerUp) add(collegeByParticipantId.get(doc.runnerUp), "runnerUps", 3);
    }

    const colleges = [...totals.entries()]
      .map(([collegeName, t]) => ({ collegeName, ...t }))
      .sort((a, b) => b.points - a.points);

    res.json({ colleges });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load leaderboard" });
  }
});

app.post("/api/admin/send-reminders", requireAdmin, requireFullAdmin, async (req, res) => {
  try {
    const db = await getDb();
    const registrations = await db
      .collection("registrations")
      .find({ paymentVerified: true })
      .toArray();

    const results = await Promise.all(
      registrations.map(async (reg) => {
        const result = await sendReminderEmail(reg);
        await db.collection("registrations").updateOne(
          { _id: reg._id },
          {
            $set: {
              reminderEmailSent: result.sent,
              reminderEmailError: result.error,
              reminderEmailSentAt: new Date(),
            },
          }
        );
        return result;
      })
    );

    const failed = results.filter((r) => !r.sent).length;
    res.json({ ok: true, count: registrations.length, failed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send reminder emails" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
