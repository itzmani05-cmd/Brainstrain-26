import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import PageBackdrop from "../../components/PageBackdrop";
import ScriptHeading from "../../components/ScriptHeading";
import { getEventBySlug } from "../../data/events";
import { apiUrl } from "../../lib/api";

export default function AdminEventAttendancePage() {
  const navigate = useNavigate();
  const { eventSlug } = useParams();
  const event = getEventBySlug(eventSlug);

  const [registrations, setRegistrations] = useState(null);
  const [error, setError] = useState("");

  function authHeaders() {
    const token = localStorage.getItem("bs_admin_token");
    return { Authorization: `Bearer ${token}` };
  }

  useEffect(() => {
    const token = localStorage.getItem("bs_admin_token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetch(apiUrl("/api/admin/registrations"), { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("bs_admin_token");
          navigate("/admin/login");
          return null;
        }
        if (!res.ok) throw new Error("Failed to load registrations");
        return res.json();
      })
      .then((body) => {
        if (body) setRegistrations(body.registrations.filter((r) => r.paymentVerified));
      })
      .catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventSlug]);

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

  const presentCount =
    registrations?.filter((r) => r.attendance?.[eventSlug]).length ?? 0;

  return (
    <PageBackdrop>
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-32">
        <Link
          to="/admin"
          className="mb-4 inline-block font-body text-xs tracking-wide text-white/50 hover:text-white"
        >
          ← ALL REGISTRATIONS
        </Link>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <ScriptHeading as="h1">{event ? event.name : eventSlug}</ScriptHeading>
          {registrations && (
            <span className="font-body text-sm text-bs-white/60">
              {presentCount} / {registrations.length} present
            </span>
          )}
        </div>

        {error && <p className="font-body text-sm text-red-400">{error}</p>}

        {!registrations && !error && <p className="font-body text-bs-white/60">Loading…</p>}

        {registrations && registrations.length === 0 && (
          <p className="font-body text-bs-white/60">
            No verified registrants yet. Verify payments on the main dashboard first.
          </p>
        )}

        {registrations && registrations.length > 0 && (
          <div className="glass-card divide-y divide-white/5 rounded-[24px] p-2 sm:p-4">
            {registrations.map((reg) => {
              const present = !!reg.attendance?.[eventSlug];
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
                  </div>
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageBackdrop>
  );
}
