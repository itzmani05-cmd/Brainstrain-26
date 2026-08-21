import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Modal from "../../components/admin/Modal";
import { supabase } from "../../lib/supabaseClient";

const inputClass =
  "rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-body text-sm text-white outline-none placeholder:text-white/30 focus:border-bs-pink focus:ring-2 focus:ring-bs-pink/30";

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [membersModal, setMembersModal] = useState(null); // { team, members }
  const [membersLoading, setMembersLoading] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [teamsRes, eventsRes] = await Promise.all([
          supabase
            .from("teams")
            .select("*, events(id, name), team_members(id)")
            .order("created_at", { ascending: false }),
          supabase.from("events").select("id, name").order("name"),
        ]);
        if (!active) return;
        setTeams(teamsRes.data ?? []);
        setEvents(eventsRes.data ?? []);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  async function openMembers(team) {
    setMembersLoading(true);
    setMembersModal({ team, members: [] });
    try {
      const { data } = await supabase.from("team_members").select("*").eq("team_id", team.id);
      setMembersModal({ team, members: data ?? [] });
    } finally {
      setMembersLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teams.filter((t) => {
      if (eventFilter && t.events?.id !== eventFilter) return false;
      if (!q) return true;
      return (
        t.team_name?.toLowerCase().includes(q) ||
        t.leader_name?.toLowerCase().includes(q) ||
        t.leader_email?.toLowerCase().includes(q)
      );
    });
  }, [teams, search, eventFilter]);

  return (
    <AdminLayout>
      <h1 className="font-body text-2xl font-bold text-white sm:text-3xl">Teams</h1>
      <p className="mt-1 font-body text-sm text-bs-white/60">
        {teams.length} total · {filtered.length} shown
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          className={`${inputClass} min-w-[220px] flex-1`}
          placeholder="Search team name or leader…"
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
      </div>

      <div className="glass-card mt-6 overflow-x-auto rounded-2xl p-2 sm:p-4">
        <table className="w-full min-w-[700px] text-left font-body text-sm">
          <thead>
            <tr className="border-b border-white/10 text-bs-white/50">
              <th className="p-3 font-medium">Team</th>
              <th className="p-3 font-medium">Event</th>
              <th className="p-3 font-medium">Leader</th>
              <th className="p-3 font-medium">Size</th>
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
                  No teams match your filters.
                </td>
              </tr>
            )}
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-white/5 text-white/90">
                <td className="p-3 font-medium">{t.team_name}</td>
                <td className="p-3">{t.events?.name ?? "—"}</td>
                <td className="p-3">
                  <p>{t.leader_name}</p>
                  <p className="text-xs text-bs-white/50">{t.leader_email}</p>
                </td>
                <td className="p-3">{(t.team_members?.length ?? 0) + 1} members</td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => openMembers(t)}
                    className="rounded-md border border-white/20 px-2.5 py-1 text-xs text-white/80 hover:border-bs-blue"
                  >
                    View Members
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!membersModal}
        onClose={() => setMembersModal(null)}
        title={membersModal?.team.team_name ?? ""}
      >
        {membersModal && (
          <div className="flex flex-col gap-4 font-body text-sm text-white/90">
            <div className="rounded-lg border border-bs-pink/30 bg-bs-pink/5 p-3">
              <p className="text-xs uppercase tracking-wide text-bs-pink">Leader</p>
              <p className="mt-1 font-medium">{membersModal.team.leader_name}</p>
              <p className="text-xs text-bs-white/60">
                {membersModal.team.leader_email} · {membersModal.team.leader_phone}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-bs-white/50">
                Members ({membersModal.members.length})
              </p>
              {membersLoading && <p className="text-bs-white/50">Loading…</p>}
              {!membersLoading && membersModal.members.length === 0 && (
                <p className="text-bs-white/50">No additional members.</p>
              )}
              <div className="flex flex-col gap-2">
                {membersModal.members.map((m) => (
                  <div key={m.id} className="rounded-lg border border-white/10 p-3">
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-bs-white/50">
                      {m.email || "—"} {m.phone ? `· ${m.phone}` : ""}
                    </p>
                    {m.college && <p className="text-xs text-bs-white/50">{m.college}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
