import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import PageBackdrop from "../../components/PageBackdrop";
import ScriptHeading from "../../components/ScriptHeading";
import { getEventBySlug } from "../../data/events";
import { apiUrl } from "../../lib/api";
import { decodeAdminToken } from "../../lib/adminToken";
import useSeo, { SITE_NAME } from "../../hooks/useSeo";

export default function AdminEventAttendancePage() {
  const navigate = useNavigate();
  const { eventSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const event = getEventBySlug(eventSlug);

  useSeo({
    title: `${event ? event.name : eventSlug} Attendance | ${SITE_NAME}`,
    path: `/admin/${eventSlug}`,
    noindex: true,
  });

  const [registrations, setRegistrations] = useState(null);
  const [error, setError] = useState("");
  const [forbidden, setForbidden] = useState(false);
  const [search, setSearch] = useState("");
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [resultInputs, setResultInputs] = useState({ winner: [""], runnerUp: [""], thirdPlace: "" });
  const [resultSaving, setResultSaving] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);
  const [resultError, setResultError] = useState("");

  function authHeaders() {
    const token = localStorage.getItem("bs_admin_token");
    return { Authorization: `Bearer ${token}` };
  }

  useEffect(() => {
    if (!event) return;

    // A coordinator pass link carries its token as ?pass=… — adopt it as the
    // stored admin token, then drop it from the URL.
    const passToken = searchParams.get("pass");
    if (passToken) {
      localStorage.setItem("bs_admin_token", passToken);
      setSearchParams((params) => {
        params.delete("pass");
        return params;
      }, { replace: true });
      return;
    }

    const token = localStorage.getItem("bs_admin_token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    setIsCoordinator(!!decodeAdminToken(token)?.eventSlug);
    setForbidden(false);

    fetch(apiUrl(`/api/admin/events/${eventSlug}/registrations`), { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("bs_admin_token");
          navigate("/admin/login");
          return null;
        }
        if (res.status === 403) {
          setForbidden(true);
          return null;
        }
        if (!res.ok) throw new Error("Failed to load registrations");
        return res.json();
      })
      .then((body) => {
        if (body) setRegistrations(body.registrations);
      })
      .catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventSlug, searchParams]);

  useEffect(() => {
    if (!event) return;
    fetch(apiUrl(`/api/events/${eventSlug}/result`))
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (body) {
          setResultInputs({
            winner: body.winner?.length ? body.winner.map((p) => p.id) : [""],
            runnerUp: body.runnerUp?.length ? body.runnerUp.map((p) => p.id) : [""],
            thirdPlace: body.thirdPlace?.id || "",
          });
        }
      })
      .catch(() => {});
  }, [eventSlug, event]);

  // Instant local lookup against the registrants already loaded for this
  // event, so the admin sees who an ID belongs to before saving.
  function lookupParticipant(id) {
    const trimmed = id.trim().toUpperCase();
    if (!trimmed) return null;
    return registrations?.find((r) => r.participantId === trimmed) || null;
  }

  // Winner/runner-up hold one input per team member; third place stays single.
  function addPlacementField(key) {
    setResultInputs((r) => ({ ...r, [key]: [...r[key], ""] }));
    setResultSaved(false);
  }

  function updatePlacementField(key, index, value) {
    setResultInputs((r) => ({
      ...r,
      [key]: r[key].map((v, i) => (i === index ? value : v)),
    }));
    setResultSaved(false);
  }

  function removePlacementField(key, index) {
    setResultInputs((r) => ({
      ...r,
      [key]: r[key].length > 1 ? r[key].filter((_, i) => i !== index) : r[key],
    }));
    setResultSaved(false);
  }

  async function saveResult(e) {
    e.preventDefault();
    setResultSaving(true);
    setResultSaved(false);
    setResultError("");
    try {
      const payload = {
        winner: resultInputs.winner.map((v) => v.trim()).filter(Boolean),
        runnerUp: resultInputs.runnerUp.map((v) => v.trim()).filter(Boolean),
        thirdPlace: resultInputs.thirdPlace,
      };
      const res = await fetch(apiUrl(`/api/admin/events/${eventSlug}/result`), {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Failed to save result");
      setResultSaved(true);
    } catch (err) {
      setResultError(err.message);
    } finally {
      setResultSaving(false);
    }
  }

  async function toggleAttendance(reg) {
    const next = !reg.attendance?.[eventSlug];
    setRegistrations((rows) =>
      rows.map((r) =>
        r._id === reg._id ? { ...r, attendance: { ...r.attendance, [eventSlug]: next } } : r
      )
    );

    try {
      const res = await fetch(apiUrl(`/api/admin/registrations/${reg._id}/attendance`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ eventSlug, present: next }),
      });
      if (!res.ok) throw new Error("Update failed");
    } catch {
      setRegistrations((rows) =>
        rows.map((r) =>
          r._id === reg._id ? { ...r, attendance: { ...r.attendance, [eventSlug]: !next } } : r
        )
      );
    }
  }

  async function toggleAdvanced(reg) {
    const next = !reg.advanced?.[eventSlug];
    setRegistrations((rows) =>
      rows.map((r) =>
        r._id === reg._id ? { ...r, advanced: { ...r.advanced, [eventSlug]: next } } : r
      )
    );

    try {
      const res = await fetch(apiUrl(`/api/admin/registrations/${reg._id}/advanced`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ eventSlug, advanced: next }),
      });
      if (!res.ok) throw new Error("Update failed");
    } catch {
      setRegistrations((rows) =>
        rows.map((r) =>
          r._id === reg._id ? { ...r, advanced: { ...r.advanced, [eventSlug]: !next } } : r
        )
      );
    }
  }

  const presentCount =
    registrations?.filter((r) => r.attendance?.[eventSlug]).length ?? 0;

  const query = search.trim().toLowerCase();
  const filteredRegistrations = registrations?.filter((r) => {
    if (!query) return true;
    return [r.name, r.participantId, r.collegeName]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(query));
  });

  if (!event) {
    return (
      <PageBackdrop>
        <div className="mx-auto max-w-4xl px-4 pb-24 pt-32">
          <Link
            to="/admin"
            className="mb-4 inline-block font-body text-xs tracking-wide text-white/50 hover:text-white"
          >
            ← ALL REGISTRATIONS
          </Link>
          <p className="font-body text-sm text-red-400">
            "{eventSlug}" isn't a Brainstrain event.
          </p>
        </div>
      </PageBackdrop>
    );
  }

  return (
    <PageBackdrop>
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-32">
        {isCoordinator ? (
          <span className="mb-4 inline-block rounded-full bg-bs-pink/20 px-2.5 py-1 font-body text-xs text-bs-pink">
            COORDINATOR PASS
          </span>
        ) : (
          <Link
            to="/admin"
            className="mb-4 inline-block font-body text-xs tracking-wide text-white/50 hover:text-white"
          >
            ← ALL REGISTRATIONS
          </Link>
        )}

        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <ScriptHeading as="h1">{event ? event.name : eventSlug}</ScriptHeading>
          {registrations && (
            <span className="font-body text-sm text-bs-white/60">
              {presentCount} / {registrations.length} present
            </span>
          )}
        </div>

        {!forbidden && (
          <form
            onSubmit={saveResult}
            className="glass-card mb-8 grid grid-cols-1 gap-3 rounded-[24px] p-5 sm:grid-cols-3 sm:p-6"
          >
            {[
              { key: "winner", emoji: "🥇", label: "WINNER" },
              { key: "runnerUp", emoji: "🥈", label: "RUNNER-UP" },
            ].map(({ key, emoji, label }) => (
              <div key={key} className="block">
                <span className="mb-1.5 flex items-center justify-between font-body text-xs tracking-[0.15em] text-bs-white/60">
                  <span>
                    {emoji} {label}
                  </span>
                  <button
                    type="button"
                    onClick={() => addPlacementField(key)}
                    className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold normal-case tracking-normal text-white/70 transition hover:bg-white/20"
                    title="Add another team member"
                  >
                    + ADD
                  </button>
                </span>
                <div className="space-y-2">
                  {resultInputs[key].map((value, index) => {
                    const match = lookupParticipant(value);
                    const typed = value.trim();
                    return (
                      <div key={index}>
                        <div className="relative">
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => updatePlacementField(key, index, e.target.value)}
                            placeholder="BS ID, e.g. BS26003"
                            className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 pr-8 font-body text-sm uppercase text-white placeholder:text-white/30 placeholder:normal-case outline-none focus:border-bs-pink"
                          />
                          {resultInputs[key].length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePlacementField(key, index)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-red-400"
                              title="Remove"
                            >
                              ×
                            </button>
                          )}
                        </div>
                        {typed && (
                          <p
                            className={`mt-1 font-body text-xs ${match ? "text-bs-blue" : "text-red-400"}`}
                          >
                            {match ? `✓ ${match.name} · ${match.collegeName}` : "ID not found"}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <label className="block">
              <span className="mb-1.5 block font-body text-xs tracking-[0.15em] text-bs-white/60">
                🥉 THIRD PLACE
              </span>
              <input
                type="text"
                value={resultInputs.thirdPlace}
                onChange={(e) => {
                  setResultInputs((r) => ({ ...r, thirdPlace: e.target.value }));
                  setResultSaved(false);
                }}
                placeholder="BS ID, e.g. BS26003"
                className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 font-body text-sm uppercase text-white placeholder:text-white/30 placeholder:normal-case outline-none focus:border-bs-pink"
              />
              {resultInputs.thirdPlace.trim() && (
                <p
                  className={`mt-1 font-body text-xs ${
                    lookupParticipant(resultInputs.thirdPlace) ? "text-bs-blue" : "text-red-400"
                  }`}
                >
                  {lookupParticipant(resultInputs.thirdPlace)
                    ? `✓ ${lookupParticipant(resultInputs.thirdPlace).name} · ${lookupParticipant(resultInputs.thirdPlace).collegeName}`
                    : "ID not found"}
                </p>
              )}
            </label>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-3">
              <button
                type="submit"
                disabled={resultSaving}
                className="rounded-full bg-bs-pink/20 px-4 py-1.5 font-body text-xs font-semibold text-bs-pink transition hover:bg-bs-pink/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {resultSaving ? "SAVING…" : "SAVE RESULTS"}
              </button>
              {resultSaved && <span className="font-body text-xs text-bs-blue">Saved ✓</span>}
              {resultError && <span className="font-body text-xs text-red-400">{resultError}</span>}
            </div>
          </form>
        )}

        {error && <p className="font-body text-sm text-red-400">{error}</p>}

        {forbidden && (
          <p className="font-body text-sm text-red-400">
            This pass link isn't valid for this event.
          </p>
        )}

        {!registrations && !error && !forbidden && (
          <p className="font-body text-bs-white/60">Loading…</p>
        )}

        {registrations && registrations.length === 0 && (
          <p className="font-body text-bs-white/60">
            No verified registrants yet. Verify payments on the main dashboard first.
          </p>
        )}

        {registrations && registrations.length > 0 && (
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, or college…"
            className="mb-4 w-full rounded-lg border border-white/20 bg-black/30 px-4 py-2.5 font-body text-sm text-white placeholder:text-white/30 outline-none transition focus:border-bs-pink focus:shadow-[0_0_0_3px_rgba(209,58,170,0.25)]"
          />
        )}

        {registrations && registrations.length > 0 && filteredRegistrations.length === 0 && (
          <p className="font-body text-bs-white/60">No registrants match your search.</p>
        )}

        {registrations && filteredRegistrations && filteredRegistrations.length > 0 && (
          <div className="glass-card divide-y divide-white/5 rounded-[24px] p-2 sm:p-4">
            {filteredRegistrations.map((reg) => {
              const present = !!reg.attendance?.[eventSlug];
              const advanced = !!reg.advanced?.[eventSlug];
              return (
                <div
                  key={reg._id}
                  className="flex flex-wrap items-center justify-between gap-3 px-3 py-3"
                >
                  <div>
                    <p className="font-body text-sm font-semibold text-white">{reg.name}</p>
                    <p className="font-body text-xs text-white/50">
                      {reg.participantId} · {reg.collegeName}
                    </p>
                    <p className="font-body text-xs text-white/50">
                      {reg.email} · {reg.phone}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleAttendance(reg)}
                      className={`rounded-full px-4 py-1.5 font-body text-xs font-semibold transition ${
                        present
                          ? "bg-bs-blue/25 text-bs-blue shadow-[0_0_10px_rgba(0,154,201,0.4)]"
                          : "bg-white/10 text-white/50 hover:bg-white/15"
                      }`}
                    >
                      {present ? "✓ PRESENT" : "MARK PRESENT"}
                    </button>
                    {event?.rounds > 1 && (
                      <button
                        type="button"
                        onClick={() => toggleAdvanced(reg)}
                        className={`rounded-full px-4 py-1.5 font-body text-xs font-semibold transition ${
                          advanced
                            ? "bg-bs-pink/25 text-bs-pink shadow-[0_0_10px_rgba(209,58,170,0.4)]"
                            : "bg-white/10 text-white/50 hover:bg-white/15"
                        }`}
                      >
                        {advanced ? "✓ ADVANCED" : "MARK ADVANCED"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageBackdrop>
  );
}
