import crypto from "crypto";

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const tokens = new Map(); // token -> expiresAt

export function issueToken() {
  const token = crypto.randomBytes(32).toString("hex");
  tokens.set(token, Date.now() + TOKEN_TTL_MS);
  return token;
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  const expiresAt = token && tokens.get(token);

  if (!expiresAt || expiresAt < Date.now()) {
    if (token) tokens.delete(token);
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}
