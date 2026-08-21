import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Modal from "../../components/admin/Modal";
import Badge from "../../components/admin/Badge";
import { supabase } from "../../lib/supabaseClient";

const inputClass =
  "rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-body text-sm text-white outline-none placeholder:text-white/30 focus:border-bs-pink focus:ring-2 focus:ring-bs-pink/30";

export default function AdminParticipantsPage() {
  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      let regsRes, membersRes, eventsRes;
      try {
        [regsRes, membersRes, eventsRes] = await Promise.all([
          supabase
            .from("registrations")
            .select("id, name, email, phone, college, department, year, created_at, events(id, name), teams(team_name)"),
          supabase
            .from("team_members")
            .select("id, name, email, phone, college, created_at, teams(team_name, events(id, name))"),
          supabase.from("events").select("id, name").order("name"),
        ]);
      } catch {
        if (active) setLoading(false);
        return;
      }
      if (!active) return;

      const leaders = (regsRes.data ?? []).map((r) => ({
        id: `reg-${r.id}`,
        name: r.name,
        email: r.email,
        phone: r.phone,
        college: r.college,
        department: r.department,
        year: r.year,
        event_id: r.events?.id,
        event_name: r.events?.name,
        team_name: r.teams?.team_name,
        role: r.teams?.team_name ? "Team Leader" : "Individual",
        created_at: r.created_at,
      }));

      const members = (membersRes.data ?? []).map((m) => ({
        id: `mem-${m.id}`,
        name: m.name,
        email: m.email,
        phone: m.phone,
        college: m.college,
        department: null,
        year: null,
        event_id: m.teams?.events?.id,
        event_name: m.teams?.events?.name,
        team_name: m.teams?.team_name,
        role: "Team Member",
        created_at: m.created_at,
      }));

      setParticipants([...leaders, ...members].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      setEvents(eventsRes.data ?? []);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return participants.filter((p) => {
      if (eventFilter && p.event_id !== eventFilter) return false;
      if (roleFilter && p.role !== roleFilter) return false;
      if (!q) return true;
      return (
        p.name?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.phone?.includes(q) ||
        p.college?.toLowerCase().includes(q)
      );
    });
  }, [participants, search, eventFilter, roleFilter]);

  const roleColor = {
    "Team Leader": "pink",
    "Team Member": "blue",
    Individual: "gray",
  };

  return (
    <AdminLayout>
      <h1 className="font-body text-2xl font-bold text-white sm:text-3xl">Participants</h1>
      <p className="mt-1 font-body text-sm text-bs-white/60">
        {participants.length} total · {filtered.length} shown
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          className={`${inputClass} min-w-[220px] flex-1`}
          placeholder="Search name, email, phone, college…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className={inputClass} value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
          <option value="">All events</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.name}
            </option>
          ))}
        </select>
        <select className={inputClass} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All roles</option>
          <option value="Individual">Individual</option>
          <option value="Team Leader">Team Leader</option>
          <option value="Team Member">Team Member</option>
        </select>
      </div>

      <div className="glass-card mt-6 overflow-x-auto rounded-2xl p-2 sm:p-4">
        <table className="w-full min-w-[800px] text-left font-body text-sm">
          <thead>
            <tr className="border-b border-white/10 text-bs-white/50">
              <th className="p-3 font-medium">Participant</th>
              <th className="p-3 font-medium">Event</th>
              <th className="p-3 font-medium">Team</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-bs-white/50">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-bs-white/50">
                  No participants match your filters.
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-white/5 text-white/90">
                <td className="p-3">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-bs-white/50">{p.email}</p>
                </td>
                <td className="p-3">{p.event_name ?? "—"}</td>
                <td className="p-3">{p.team_name ?? "—"}</td>
                <td className="p-3">
                  <Badge color={roleColor[p.role] ?? "gray"}>{p.role}</Badge>
                </td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => setDetail(p)}
                    className="rounded-md border border-white/20 px-2.5 py-1 text-xs text-white/80 hover:border-bs-blue"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Participant Details">
        {detail && (
          <div className="flex flex-col gap-2 font-body text-sm text-white/90">
            <p>
              <span className="text-bs-white/50">Name:</span> {detail.name}
            </p>
            <p>
              <span className="text-bs-white/50">Email:</span> {detail.email || "—"}
            </p>
            <p>
              <span className="text-bs-white/50">Phone:</span> {detail.phone || "—"}
            </p>
            <p>
              <span className="text-bs-white/50">College:</span> {detail.college || "—"}
            </p>
            {detail.department && (
              <p>
                <span className="text-bs-white/50">Department:</span> {detail.department}
              </p>
            )}
            {detail.year && (
              <p>
                <span className="text-bs-white/50">Year:</span> {detail.year}
              </p>
            )}
            <p>
              <span className="text-bs-white/50">Event:</span> {detail.event_name ?? "—"}
            </p>
            {detail.team_name && (
              <p>
                <span className="text-bs-white/50">Team:</span> {detail.team_name}
              </p>
            )}
            <p>
              <span className="text-bs-white/50">Role:</span>{" "}
              <Badge color={roleColor[detail.role] ?? "gray"}>{detail.role}</Badge>
            </p>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
