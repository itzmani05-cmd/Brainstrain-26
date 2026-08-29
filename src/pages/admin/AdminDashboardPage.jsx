import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageBackdrop from "../../components/PageBackdrop";
import ScriptHeading from "../../components/ScriptHeading";
import events from "../../data/events";
import { apiUrl } from "../../lib/api";

function StepFlag({ done, label }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-body text-xs ${
        done ? "bg-bs-blue/20 text-bs-blue" : "bg-white/10 text-white/40"
      }`}
    >
      {done ? "✓" : "—"} {label}
    </span>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState(null);
  const [error, setError] = useState("");
  const [fee, setFee] = useState(null);
  const [feeInput, setFeeInput] = useState("");
  const [feeSaving, setFeeSaving] = useState(false);
  const [feeSaved, setFeeSaved] = useState(false);

  function authHeaders() {
    const token = localStorage.getItem("bs_admin_token");
    return { Authorization: `Bearer ${token}` };
  }

  async function load() {
    const token = localStorage.getItem("bs_admin_token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const res = await fetch(apiUrl("/api/admin/registrations"), { headers: authHeaders() });
      if (res.status === 401) {
        localStorage.removeItem("bs_admin_token");
        navigate("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to load registrations");
      const body = await res.json();
      setRegistrations(body.registrations);
    } catch (err) {
      setError(err.message);
    }

    fetch(apiUrl("/api/registration-fee"))
      .then((res) => res.json())
      .then((body) => {
        setFee(body.amount);
        setFeeInput(String(body.amount));
      })
      .catch(() => {});
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveFee(amount) {
    setFeeSaving(true);
    setFeeSaved(false);
    try {
      const res = await fetch(apiUrl("/api/admin/registration-fee"), {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error("Failed to update fee");
      setFee(amount);
      setFeeInput(String(amount));
      setFeeSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setFeeSaving(false);
    }
  }

  async function togglePaymentVerified(reg) {
    const next = !reg.paymentVerified;
    setRegistrations((rows) =>
      rows.map((r) => (r._id === reg._id ? { ...r, paymentVerified: next } : r))
    );

    try {
      const res = await fetch(apiUrl(`/api/admin/registrations/${reg._id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ paymentVerified: next }),
      });
      if (!res.ok) throw new Error("Update failed");
      const body = await res.json();
      if (body.participantId) {
        setRegistrations((rows) =>
          rows.map((r) => (r._id === reg._id ? { ...r, participantId: body.participantId } : r))
        );
      }
    } catch {
      // revert on failure
      setRegistrations((rows) =>
        rows.map((r) => (r._id === reg._id ? { ...r, paymentVerified: !next } : r))
      );
    }
  }

  function logout() {
    localStorage.removeItem("bs_admin_token");
    navigate("/admin/login");
  }

  return (
    <PageBackdrop>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-32">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <ScriptHeading as="h1">Registrations</ScriptHeading>
          <button
            type="button"
            onClick={logout}
            className="font-body text-sm text-white/60 underline-offset-4 transition hover:text-white hover:underline"
          >
            LOG OUT
          </button>
        </div>

        <div className="glass-card mb-8 rounded-[24px] p-5 sm:p-6">
          <h2 className="font-body text-xs tracking-[0.2em] text-bs-white/60">REGISTRATION FEE</h2>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="font-body text-2xl font-semibold text-white">
              {fee != null ? `₹${fee}` : "…"}
            </span>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => saveFee(189)}
                className="rounded-full border border-white/20 px-3 py-1.5 font-body text-xs text-white/70 transition hover:border-bs-blue hover:text-white"
              >
                SET ₹189 (EARLY BIRD)
              </button>
              <button
                type="button"
                onClick={() => saveFee(199)}
                className="rounded-full border border-white/20 px-3 py-1.5 font-body text-xs text-white/70 transition hover:border-bs-blue hover:text-white"
              >
                SET ₹199 (STANDARD)
              </button>

              <input
                type="number"
                min="1"
                value={feeInput}
                onChange={(e) => {
                  setFeeInput(e.target.value);
                  setFeeSaved(false);
                }}
                className="w-24 rounded-lg border border-white/20 bg-black/30 px-3 py-1.5 font-body text-sm text-white outline-none focus:border-bs-pink"
              />
              <button
                type="button"
                disabled={feeSaving || !feeInput || Number(feeInput) === fee}
                onClick={() => saveFee(Number(feeInput))}
                className="rounded-full bg-bs-pink/20 px-3 py-1.5 font-body text-xs font-semibold text-bs-pink transition hover:bg-bs-pink/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {feeSaving ? "SAVING…" : "SAVE"}
              </button>
              {feeSaved && <span className="font-body text-xs text-bs-blue">Saved ✓</span>}
            </div>
          </div>
        </div>

        <div className="glass-card mb-8 rounded-[24px] p-5 sm:p-6">
          <h2 className="font-body text-xs tracking-[0.2em] text-bs-white/60">
            EVENT ATTENDANCE
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {events.map((ev) => (
              <Link
                key={ev.slug}
                to={`/admin/${ev.slug}`}
                className="rounded-full border border-white/20 px-3 py-1.5 font-body text-xs text-white/80 transition hover:border-bs-blue hover:text-white"
              >
                {ev.name} →
              </Link>
            ))}
          </div>
        </div>

        {error && <p className="font-body text-sm text-red-400">{error}</p>}

        {!registrations && !error && (
          <p className="font-body text-bs-white/60">Loading…</p>
        )}

        {registrations && registrations.length === 0 && (
          <p className="font-body text-bs-white/60">No registrations yet.</p>
        )}

        {registrations && registrations.length > 0 && (
          <div className="glass-card overflow-x-auto rounded-[24px] p-4 sm:p-6">
            <table className="w-full min-w-[900px] border-collapse font-body text-sm text-white/90">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-white/50">
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Contact</th>
                  <th className="px-3 py-3">College</th>
                  <th className="px-3 py-3">Payment</th>
                  <th className="px-3 py-3">Steps</th>
                  <th className="px-3 py-3">Verified</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg._id} className="border-b border-white/5 align-top">
                    <td className="px-3 py-3 font-semibold">{reg.name}</td>
                    <td className="px-3 py-3 text-white/70">
                      <div>{reg.email}</div>
                      <div>{reg.phone}</div>
                    </td>
                    <td className="px-3 py-3 text-white/70">
                      <div>{reg.collegeName}</div>
                      <div>{reg.collegeCity}</div>
                    </td>
                    <td className="px-3 py-3 text-white/70">
                      <div className="font-semibold text-white">
                        {reg.amount != null ? `₹${reg.amount}` : "—"}
                      </div>
                      <div>{reg.timestamp}</div>
                      <div className="text-xs text-white/50">{reg.transactionId}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <StepFlag done={!!reg.step1CompletedAt} label="STEP 1" />
                        <StepFlag done={!!reg.step2CompletedAt} label="STEP 2" />
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => togglePaymentVerified(reg)}
                        className={`rounded-full px-3 py-1.5 font-body text-xs font-semibold transition ${
                          reg.paymentVerified
                            ? "bg-bs-pink/25 text-bs-pink shadow-[0_0_10px_rgba(209,58,170,0.4)]"
                            : "bg-white/10 text-white/50 hover:bg-white/15"
                        }`}
                      >
                        {reg.paymentVerified ? "✓ VERIFIED" : "MARK VERIFIED"}
                      </button>
                      {reg.participantId && (
                        <div className="mt-1.5 font-body text-xs text-bs-blue">
                          {reg.participantId}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageBackdrop>
  );
}
