import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import PageBackdrop from "../components/PageBackdrop";
import ScriptHeading from "../components/ScriptHeading";
import Reveal from "../components/Reveal";
import { useAuth } from "../context/AuthContext";
import bsLogo from "../assets/bs-logo.png";

export default function LoginPage() {
  const { session, isAdmin, loading, signInWithPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error, profile } = await signInWithPassword(email, password);
    setSubmitting(false);

    if (error) {
      setError(error.message || "Could not sign in.");
      return;
    }
    if (profile?.role !== "admin") {
      setError("This account doesn't have admin access.");
      return;
    }
    const dest = location.state?.from?.pathname || "/admin/dashboard";
    navigate(dest, { replace: true });
  }

  return (
    <PageBackdrop>
      <div className="flex min-h-screen items-center justify-center px-4 py-16">
        <Reveal className="glass-card w-full max-w-md rounded-[28px] p-8 sm:p-10">
          <div className="mb-8 flex flex-col items-center">
            <img src={bsLogo} alt="" className="animate-float mb-4 h-16 w-16" />
            <ScriptHeading as="h1" className="text-4xl sm:text-5xl">
              Admin Login
            </ScriptHeading>
            <p className="mt-2 text-center font-body text-sm text-bs-white/60">
              Brainstrain &lsquo;26 organiser access
            </p>
          </div>

          {location.state?.denied && (
            <p className="mb-4 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-2 text-center font-body text-sm text-red-300">
              You don&apos;t have permission to view that page.
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block font-body text-sm text-bs-white/70">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-black/40 px-4 py-3 font-body text-white outline-none placeholder:text-white/30 focus:border-bs-pink focus:ring-2 focus:ring-bs-pink/40"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-sm text-bs-white/70">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-black/40 px-4 py-3 font-body text-white outline-none placeholder:text-white/30 focus:border-bs-pink focus:ring-2 focus:ring-bs-pink/40"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-2 font-body text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="neon-border-pink mt-2 rounded-lg py-3 font-body text-lg text-white transition hover:scale-[1.02] disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </Reveal>
      </div>
    </PageBackdrop>
  );
}
