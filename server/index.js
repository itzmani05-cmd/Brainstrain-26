import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { ObjectId } from "mongodb";
import { getDb } from "./db.js";
import { issueToken, requireAdmin } from "./auth.js";

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
  return `BS26-${String(seq).padStart(4, "0")}`;
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
      !referralCode ||
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

    const result = await db.collection("registrations").insertOne({
      name,
      email,
      phone,
      collegeName,
      collegeCity,
      referralCode,
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

    res.json({ ok: true, id: result.insertedId });
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

    if (paymentVerified) {
      const existing = await db.collection("registrations").findOne({ _id });
      if (existing && !existing.participantId) {
        update.$set.participantId = await nextParticipantId(db);
      }
    }

    await db.collection("registrations").updateOne({ _id }, update);
    const updated = await db.collection("registrations").findOne({ _id });

    res.json({ ok: true, participantId: updated?.participantId ?? null });
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

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
