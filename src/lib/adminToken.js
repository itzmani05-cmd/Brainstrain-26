// Reads the (unverified) claims out of an admin token for UI purposes only —
// e.g. showing "coordinator pass" chrome. The server independently verifies
// the signature and enforces scope on every request.
export function decodeAdminToken(token) {
  if (!token) return null;
  try {
    const [payload] = token.split(".");
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}
