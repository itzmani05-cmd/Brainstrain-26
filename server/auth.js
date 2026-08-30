import crypto from "crypto";

// Tokens are signed statelessly (payload + HMAC signature) rather than kept in an
// in-memory Map, so admins stay logged in across server restarts (e.g. Render's
// free tier spinning the process down after inactivity would otherwise wipe
// every issued token and force a re-login on the next request).
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function secret() {
  return process.env.ADMIN_PASSWORD || "";
}

function sign(payload) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function issueToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS })).toString(
    "base64url"
  );
  return `${payload}.${sign(payload)}`;
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  const [payload, signature] = token ? token.split(".") : [];

  if (!payload || !signature) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!exp || exp < Date.now()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}
