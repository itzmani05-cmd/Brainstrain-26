import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageBackdrop from "../../components/PageBackdrop";
import ScriptHeading from "../../components/ScriptHeading";
import events from "../../data/events";
import { apiUrl } from "../../lib/api";
import { decodeAdminToken } from "../../lib/adminToken";
import useSeo, { SITE_NAME } from "../../hooks/useSeo";

function EventPassButton({ slug, authHeaders }) {
  const [working, setWorking] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setWorking(true);
    setError(false);
    setCopied(false);
    try {
      const res = await fetch(apiUrl("/api/admin/event-pass"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ eventSlug: slug }),
      });
      if (!res.ok) throw new Error("Failed to generate pass");
      const { token } = await res.json();
      setUrl(`${window.location.origin}/admin/${slug}?pass=${token}`);
    } catch {
      setError(true);
    } finally {
      setWorking(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard permission denied — the link is still visible to select/copy manually
    }
  }

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={generate}
        disabled={working}
        className={`rounded-full border px-3 py-1.5 font-body text-xs transition disabled:cursor-not-allowed disabled:opacity-60 ${
          error
            ? "border-red-400/60 text-red-400"
            : "border-white/20 text-white/70 hover:border-bs-pink hover:text-white"
        }`}
      >
        {working ? "GENERATING…" : error ? "FAILED — RETRY" : url ? "REGENERATE PASS" : "GENERATE PASS"}
      </button>
      {url && (
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <input
            type="text"
            readOnly
            value={url}
            onFocus={(e) => e.target.select()}
            className="min-w-0 flex-1 rounded-lg border border-white/20 bg-black/30 px-2.5 py-1.5 font-body text-xs text-white/80 outline-none focus:border-bs-pink"
          />
          <button
            type="button"
            onClick={copy}
            className={`shrink-0 rounded-full border px-3 py-1.5 font-body text-xs transition ${
              copied
                ? "border-bs-blue text-bs-blue"
                : "border-white/20 text-white/70 hover:border-bs-pink hover:text-white"
            }`}
          >
            {copied ? "COPIED ✓" : "COPY"}
          </button>
        </div>
      )}
    </div>
  );
}

const MANUAL_EMPTY = {
  name: "",
  email: "",
  phone: "",
  collegeName: "",
  collegeCity: "",
  referralCode: "",
  attendingDrama: false,
  dramaLeaderName: "",
  dramaCollegeName: "",
};

const manualInputClass =
  "w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 font-body text-sm text-white placeholder:text-white/30 outline-none focus:border-bs-pink";

function ManualRegistrationForm({ authHeaders, onRegistered }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(MANUAL_EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lastId, setLastId] = useState("");

  function update(field, value) {
    setData((d) => ({ ...d, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setLastId("");
    try {
      const res = await fetch(apiUrl("/api/admin/registrations/manual"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Failed to register");
      setLastId(body.participantId);
      setData(MANUAL_EMPTY);
      onRegistered();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-bs-blue/20 px-4 py-1.5 font-body text-xs font-semibold text-bs-blue transition hover:bg-bs-blue/30"
      >
        + REGISTER WALK-IN
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-1 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          required
          placeholder="Name"
          value={data.name}
          onChange={(e) => update("name", e.target.value)}
          className={manualInputClass}
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          className={manualInputClass}
        />
        <input
          type="tel"
          required
          pattern="[0-9]{10}"
          title="Enter a 10-digit phone number"
          placeholder="Phone"
          value={data.phone}
          onChange={(e) => update("phone", e.target.value)}
          className={manualInputClass}
        />
        <input
          type="text"
          placeholder="Referral code (optional)"
          value={data.referralCode}
          onChange={(e) => update("referralCode", e.target.value)}
          className={manualInputClass}
        />
        <input
          type="text"
          required
          placeholder="College name"
          value={data.collegeName}
          onChange={(e) => update("collegeName", e.target.value)}
          className={manualInputClass}
        />
        <input
          type="text"
          required
          placeholder="College city"
          value={data.collegeCity}
          onChange={(e) => update("collegeCity", e.target.value)}
          className={manualInputClass}
        />
      </div>

      <label className="flex items-center gap-2 font-body text-sm text-white/80">
        <input
          type="checkbox"
          checked={data.attendingDrama}
          onChange={(e) => update("attendingDrama", e.target.checked)}
          className="h-4 w-4 rounded border-white/30 bg-black/30 accent-bs-pink"
        />
        Attending Drama?
      </label>

      {data.attendingDrama && (
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            required
            placeholder="Team leader name"
            value={data.dramaLeaderName}
            onChange={(e) => update("dramaLeaderName", e.target.value)}
            className={manualInputClass}
          />
          <input
            type="text"
            required
            placeholder="Team name"
            value={data.dramaCollegeName}
            onChange={(e) => update("dramaCollegeName", e.target.value)}
            className={manualInputClass}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-bs-pink/20 px-4 py-1.5 font-body text-xs font-semibold text-bs-pink transition hover:bg-bs-pink/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "SAVING…" : "SAVE & VERIFY"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-body text-xs text-white/50 underline-offset-4 hover:text-white hover:underline"
        >
          CANCEL
        </button>
        {lastId && (
          <span className="font-body text-xs text-bs-blue">Registered as {lastId} ✓</span>
        )}
        {error && <span className="font-body text-xs text-red-400">{error}</span>}
      </div>
    </form>
  );
}

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

function EmailFlag({ label, sent, error }) {
  if (sent == null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 font-body text-xs text-white/30">
        — {label}
      </span>
    );
  }
  return (
    <span
      title={error || undefined}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-body text-xs ${
        sent
          ? "bg-bs-blue/20 text-bs-blue"
          : "bg-red-500/20 text-red-400 shadow-[0_0_10px_rgba(248,113,113,0.35)]"
      }`}
    >
      {sent ? "✓" : "✕"} {label}
    </span>
  );
}

export default function AdminDashboardPage() {
  useSeo({ title: `Admin | ${SITE_NAME}`, path: "/admin", noindex: true });

  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState(null);
  const [error, setError] = useState("");
  const [fee, setFee] = useState(null);
  const [feeInput, setFeeInput] = useState("");
  const [feeSaving, setFeeSaving] = useState(false);
  const [feeSaved, setFeeSaved] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(null);
  const [statusSaving, setStatusSaving] = useState(false);
  const [results, setResults] = useState(null);
  const [remindersSending, setRemindersSending] = useState(false);
  const [remindersResult, setRemindersResult] = useState("");
  const [remindersFailed, setRemindersFailed] = useState(false);

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

    const claims = decodeAdminToken(token);
    if (claims?.eventSlug) {
      // Coordinator passes are scoped to one event — send them straight there.
      navigate(`/admin/${claims.eventSlug}`, { replace: true });
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

    fetch(apiUrl("/api/registration-status"))
      .then((res) => res.json())
      .then((body) => setRegistrationOpen(body.open))
      .catch(() => {});

    Promise.all(
      events.map((ev) =>
        fetch(apiUrl(`/api/events/${ev.slug}/result`))
          .then((res) => (res.ok ? res.json() : null))
          .then((body) => [ev.slug, body])
      )
    )
      .then((entries) => setResults(Object.fromEntries(entries)))
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

  async function toggleRegistrationOpen() {
    const next = !registrationOpen;
    setStatusSaving(true);
    try {
      const res = await fetch(apiUrl("/api/admin/registration-status"), {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ open: next }),
      });
      if (!res.ok) throw new Error("Failed to update registration status");
      setRegistrationOpen(next);
    } catch (err) {
      setError(err.message);
    } finally {
      setStatusSaving(false);
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
      setRegistrations((rows) =>
        rows.map((r) =>
          r._id === reg._id
            ? {
                ...r,
                ...(body.participantId ? { participantId: body.participantId } : {}),
                ...(body.emailSent != null
                  ? { approvalEmailSent: body.emailSent, approvalEmailError: body.emailError }
                  : {}),
              }
            : r
        )
      );
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

  async function sendReminders() {
    setRemindersSending(true);
    setRemindersResult("");
    setRemindersFailed(false);
    try {
      const res = await fetch(apiUrl("/api/admin/send-reminders"), {
        method: "POST",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Failed to send reminders");
      const body = await res.json();
      const sent = body.count - body.failed;
      setRemindersFailed(body.failed > 0);
      setRemindersResult(
        body.failed > 0
          ? `Sent to ${sent} of ${body.count} registrants — ${body.failed} failed. See the Emails column for details.`
          : `Sent to ${body.count} verified registrant${body.count === 1 ? "" : "s"}.`
      );
      await load();
    } catch (err) {
      setRemindersFailed(true);
      setRemindersResult(err.message);
    } finally {
      setRemindersSending(false);
    }
  }

  return (
    <PageBackdrop>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-32">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <ScriptHeading as="h1">Registrations</ScriptHeading>
          <div className="flex items-center gap-5">
            <Link
              to="/admin/leaderboard"
              className="font-body text-sm text-white/60 underline-offset-4 transition hover:text-white hover:underline"
            >
              VIEW LEADERBOARD
            </Link>
            <button
              type="button"
              onClick={logout}
              className="font-body text-sm text-white/60 underline-offset-4 transition hover:text-white hover:underline"
            >
              LOG OUT
            </button>
          </div>
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
            ONLINE REGISTRATION
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span
              className={`font-body text-2xl font-semibold ${
                registrationOpen ? "text-bs-blue" : "text-red-400"
              }`}
            >
              {registrationOpen == null ? "…" : registrationOpen ? "OPEN" : "CLOSED"}
            </span>
            <button
              type="button"
              disabled={registrationOpen == null || statusSaving}
              onClick={toggleRegistrationOpen}
              className="ml-auto rounded-full border border-white/20 px-3 py-1.5 font-body text-xs text-white/70 transition hover:border-bs-pink hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {statusSaving
                ? "SAVING…"
                : registrationOpen
                  ? "CLOSE REGISTRATION (SHOW ON-SPOT)"
                  : "REOPEN ONLINE REGISTRATION"}
            </button>
          </div>
          <p className="mt-2 font-body text-xs text-white/40">
            When closed, the public site shows an "on-spot registration" notice instead of
            the form. Use Walk-in Registration below to enter details at the venue.
          </p>
        </div>

        <div className="glass-card mb-8 rounded-[24px] p-5 sm:p-6">
          <h2 className="font-body text-xs tracking-[0.2em] text-bs-white/60">
            WALK-IN REGISTRATION
          </h2>
          <p className="mt-1 font-body text-xs text-white/40">
            Enter a participant's details on their behalf — saved as paid &amp; verified
            immediately, with a participant ID issued on the spot.
          </p>
          <div className="mt-3">
            <ManualRegistrationForm authHeaders={authHeaders} onRegistered={load} />
          </div>
        </div>

        <div className="glass-card mb-8 rounded-[24px] p-5 sm:p-6">
          <h2 className="font-body text-xs tracking-[0.2em] text-bs-white/60">
            EVENT ATTENDANCE
          </h2>
          <p className="mt-1 font-body text-xs text-white/40">
            Each event has its own coordinator — generate a pass to give them a scoped
            login that only manages attendance for that event.
          </p>
          <div className="mt-3 flex flex-col divide-y divide-white/5">
            {events.map((ev) => (
              <div key={ev.slug} className="flex flex-wrap items-center gap-2 py-2">
                <Link
                  to={`/admin/${ev.slug}`}
                  className="rounded-full border border-white/20 px-3 py-1.5 font-body text-xs text-white/80 transition hover:border-bs-blue hover:text-white"
                >
                  {ev.name} →
                </Link>
                <EventPassButton slug={ev.slug} authHeaders={authHeaders} />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card mb-8 rounded-[24px] p-5 sm:p-6">
          <h2 className="font-body text-xs tracking-[0.2em] text-bs-white/60">RESULTS</h2>
          <p className="mt-1 font-body text-xs text-white/40">
            Winners are entered per event — click an event to add or edit its placements.
          </p>
          <div className="mt-3 flex flex-col divide-y divide-white/5">
            {events.map((ev) => {
              const r = results?.[ev.slug];
              const toEntries = (v) => (Array.isArray(v) ? v : v ? [v] : []);
              const winners = toEntries(r?.winner).filter((e) => e?.name);
              const runnerUps = toEntries(r?.runnerUp).filter((e) => e?.name);
              const hasResult = winners.length > 0;
              return (
                <Link
                  key={ev.slug}
                  to={`/admin/${ev.slug}`}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-sm transition hover:bg-white/5"
                >
                  <span className="w-32 shrink-0 font-body text-white/80">{ev.name}</span>
                  {results == null ? (
                    <span className="font-body text-xs text-white/30">…</span>
                  ) : hasResult ? (
                    <span className="font-body text-xs text-bs-white/70">
                      🥇 {winners.map((e) => e.name).join(" & ")}
                      {runnerUps.length > 0 && <> · 🥈 {runnerUps.map((e) => e.name).join(" & ")}</>}
                      {r.thirdPlace?.name && <> · 🥉 {r.thirdPlace.name}</>}
                    </span>
                  ) : (
                    <span className="font-body text-xs text-white/30">Not entered yet</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="glass-card mb-8 rounded-[24px] p-5 sm:p-6">
          <h2 className="font-body text-xs tracking-[0.2em] text-bs-white/60">
            EVENT REMINDER
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={remindersSending}
              onClick={sendReminders}
              className="rounded-full bg-bs-blue/20 px-4 py-1.5 font-body text-xs font-semibold text-bs-blue transition hover:bg-bs-blue/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {remindersSending ? "SENDING…" : "SEND REMINDER EMAILS"}
            </button>
            {remindersResult && (
              <span
                className={`font-body text-xs ${remindersFailed ? "text-red-400" : "text-bs-white/70"}`}
              >
                {remindersResult}
              </span>
            )}
          </div>
        </div>

        {registrations && registrations.length > 0 && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="glass-card rounded-[24px] p-5 sm:p-6">
              <h2 className="font-body text-xs tracking-[0.2em] text-bs-white/60">PARTICIPANTS</h2>
              <span className="mt-2 block font-body text-3xl font-semibold text-white">
                {registrations.length}
              </span>
            </div>
            <div className="glass-card rounded-[24px] p-5 sm:p-6">
              <h2 className="font-body text-xs tracking-[0.2em] text-bs-white/60">VERIFIED</h2>
              <span className="mt-2 block font-body text-3xl font-semibold text-bs-blue">
                {registrations.filter((r) => r.paymentVerified).length}
              </span>
            </div>
            <div className="glass-card rounded-[24px] p-5 sm:p-6">
              <h2 className="font-body text-xs tracking-[0.2em] text-bs-white/60">NOT VERIFIED</h2>
              <span className="mt-2 block font-body text-3xl font-semibold text-bs-pink">
                {registrations.filter((r) => !r.paymentVerified).length}
              </span>
            </div>
          </div>
        )}

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
                  <th className="px-3 py-3">Referrals</th>
                  <th className="px-3 py-3">Emails</th>
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
                    <td className="px-3 py-3 text-white/70">{reg.referralCount ?? 0}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <EmailFlag
                          label="RECEIVED"
                          sent={reg.registrationEmailSent}
                          error={reg.registrationEmailError}
                        />
                        {reg.paymentVerified && (
                          <EmailFlag
                            label="APPROVAL"
                            sent={reg.approvalEmailSent}
                            error={reg.approvalEmailError}
                          />
                        )}
                        {reg.reminderEmailSent != null && (
                          <EmailFlag
                            label="REMINDER"
                            sent={reg.reminderEmailSent}
                            error={reg.reminderEmailError}
                          />
                        )}
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
