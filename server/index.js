import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { ObjectId } from "mongodb";
import { getDb } from "./db.js";
import { issueToken, requireAdmin } from "./auth.js";
import { sendRegistrationReceivedEmail, sendApprovalEmail, sendReminderEmail } from "./email.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DEFAULT_REGISTRATION_FEE = 189;

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

app.put("/api/admin/registration-fee", requireAdmin, async (req, res) => {
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

app.get("/api/admin/registrations", requireAdmin, async (req, res) => {
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

app.patch("/api/admin/registrations/:id", requireAdmin, async (req, res) => {
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

app.post("/api/admin/send-reminders", requireAdmin, async (req, res) => {
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
