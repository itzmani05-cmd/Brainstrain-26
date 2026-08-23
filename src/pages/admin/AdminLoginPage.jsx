import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBackdrop from "../../components/PageBackdrop";
import ScriptHeading from "../../components/ScriptHeading";
import NeonButton from "../../components/NeonButton";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Login failed");
      }
      const { token } = await res.json();
      localStorage.setItem("bs_admin_token", token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageBackdrop>
      <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 pb-24 pt-32">
        <ScriptHeading as="h1" className="mb-8 text-center">
          Admin
        </ScriptHeading>

        <form onSubmit={handleSubmit} className="glass-card space-y-5 rounded-[24px] p-8">
          <label className="block">
            <span className="mb-1.5 block font-body text-xs tracking-[0.1em] text-bs-white/70">
              PASSWORD
            </span>
            <input
              type="password"
              autoFocus
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-black/30 px-4 py-2.5 font-body text-white outline-none transition focus:border-bs-pink focus:shadow-[0_0_0_3px_rgba(209,58,170,0.25)]"
            />
          </label>

          {error && <p className="font-body text-sm text-red-400">{error}</p>}

          <div className="text-center">
            <NeonButton type="submit" color="pink" disabled={loading}>
              {loading ? "CHECKING…" : "LOG IN"}
            </NeonButton>
          </div>
        </form>
      </div>
    </PageBackdrop>
  );
}
