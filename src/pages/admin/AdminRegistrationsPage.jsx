import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Modal from "../../components/admin/Modal";
import Badge from "../../components/admin/Badge";
import { supabase } from "../../lib/supabaseClient";

const inputClass =
  "rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-body text-sm text-white outline-none placeholder:text-white/30 focus:border-bs-pink focus:ring-2 focus:ring-bs-pink/30";
const statusColor = { confirmed: "green", pending: "yellow", cancelled: "red" };

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detail, setDetail] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const [regsRes, eventsRes] = await Promise.all([
        supabase
          .from("registrations")
          .select("*, events(id, name, is_team_event), teams(team_name)")
          .order("created_at", { ascending: false }),
        supabase.from("events").select("id, name").order("name"),
      ]);
      setRegistrations(regsRes.data ?? []);
      setEvents(eventsRes.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id, status) {
    await supabase.from("registrations").update({ status }).eq("id", id);
    load();
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return registrations.filter((r) => {
      if (eventFilter && r.events?.id !== eventFilter) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.name?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.phone?.includes(q) ||
        r.college?.toLowerCase().includes(q)
      );
    });
  }, [registrations, search, eventFilter, statusFilter]);

  return (
    <AdminLayout>
      <h1 className="font-body text-2xl font-bold text-white sm:text-3xl">Registrations</h1>
      <p className="mt-1 font-body text-sm text-bs-white/60">
        {registrations.length} total · {filtered.length} shown
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
        <select className={inputClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="glass-card mt-6 overflow-x-auto rounded-2xl p-2 sm:p-4">
        <table className="w-full min-w-[800px] text-left font-body text-sm">
          <thead>
            <tr className="border-b border-white/10 text-bs-white/50">
              <th className="p-3 font-medium">Participant</th>
              <th className="p-3 font-medium">Event</th>
              <th className="p-3 font-medium">Team</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Registered</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-bs-white/50">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-bs-white/50">
                  No registrations match your filters.
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-white/5 text-white/90">
                <td className="p-3">
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-bs-white/50">{r.email}</p>
                </td>
                <td className="p-3">{r.events?.name ?? "—"}</td>
                <td className="p-3">{r.teams?.team_name ?? "—"}</td>
                <td className="p-3">
                  <Badge color={statusColor[r.status] ?? "gray"}>{r.status}</Badge>
                </td>
                <td className="p-3 text-bs-white/60">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setDetail(r)}
                      className="rounded-md border border-white/20 px-2.5 py-1 text-xs text-white/80 hover:border-bs-blue"
                    >
                      View
                    </button>
                    {r.status !== "confirmed" && (
                      <button
                        type="button"
                        onClick={() => updateStatus(r.id, "confirmed")}
                        className="rounded-md border border-green-400/40 px-2.5 py-1 text-xs text-green-300"
                      >
                        Confirm
                      </button>
                    )}
                    {r.status !== "cancelled" && (
                      <button
                        type="button"
                        onClick={() => updateStatus(r.id, "cancelled")}
                        className="rounded-md border border-red-400/40 px-2.5 py-1 text-xs text-red-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Registration Details">
        {detail && (
          <div className="flex flex-col gap-2 font-body text-sm text-white/90">
            <p>
              <span className="text-bs-white/50">Name:</span> {detail.name}
            </p>
            <p>
              <span className="text-bs-white/50">Email:</span> {detail.email}
            </p>
            <p>
              <span className="text-bs-white/50">Phone:</span> {detail.phone}
            </p>
            <p>
              <span className="text-bs-white/50">College:</span> {detail.college}
            </p>
            <p>
              <span className="text-bs-white/50">Department:</span> {detail.department || "—"}
            </p>
            <p>
              <span className="text-bs-white/50">Year:</span> {detail.year || "—"}
            </p>
            <p>
              <span className="text-bs-white/50">Event:</span> {detail.events?.name}
            </p>
            {detail.teams?.team_name && (
              <p>
                <span className="text-bs-white/50">Team:</span> {detail.teams.team_name}
              </p>
            )}
            <p>
              <span className="text-bs-white/50">Status:</span>{" "}
              <Badge color={statusColor[detail.status] ?? "gray"}>{detail.status}</Badge>
            </p>
            <p>
              <span className="text-bs-white/50">Registered:</span>{" "}
              {new Date(detail.created_at).toLocaleString()}
            </p>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
