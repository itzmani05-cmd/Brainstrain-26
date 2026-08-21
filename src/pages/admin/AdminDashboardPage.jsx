import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import Badge from "../../components/admin/Badge";
import { supabase } from "../../lib/supabaseClient";

const statusColor = { confirmed: "green", pending: "yellow", cancelled: "red" };

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [events, registrations, teams, teamMembers, recentRegs] = await Promise.all([
          supabase.from("events").select("*", { count: "exact", head: true }).eq("is_active", true),
          supabase.from("registrations").select("*", { count: "exact", head: true }),
          supabase.from("teams").select("*", { count: "exact", head: true }),
          supabase.from("team_members").select("*", { count: "exact", head: true }),
          supabase
            .from("registrations")
            .select("id, name, email, status, created_at, events(name)")
            .order("created_at", { ascending: false })
            .limit(8),
        ]);

        if (!active) return;

        setStats({
          events: events.count ?? 0,
          registrations: registrations.count ?? 0,
          teams: teams.count ?? 0,
          participants: (registrations.count ?? 0) + (teamMembers.count ?? 0),
        });
        setRecent(recentRegs.data ?? []);
      } catch {
        if (!active) return;
        setStats({ events: 0, registrations: 0, teams: 0, participants: 0 });
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminLayout>
      <h1 className="font-body text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
      <p className="mt-1 font-body text-sm text-bs-white/60">
        A live snapshot of Brainstrain &lsquo;26 registrations.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Events" value={loading ? "…" : stats.events} icon="🎭" accent="pink" delay={0} />
        <StatCard
          label="Total Registrations"
          value={loading ? "…" : stats.registrations}
          icon="📝"
          accent="blue"
          delay={80}
        />
        <StatCard
          label="Total Participants"
          value={loading ? "…" : stats.participants}
          icon="🧑‍🎓"
          accent="orange"
          delay={160}
        />
        <StatCard
          label="Total Teams"
          value={loading ? "…" : stats.teams}
          icon="👥"
          accent="pink"
          delay={240}
        />
      </div>

      <div className="animate-hero-in glass-card mt-8 rounded-2xl p-5 sm:p-6" style={{ animationDelay: "320ms" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-body text-lg font-semibold text-white">Recent Registrations</h2>
          <Link to="/admin/registrations" className="font-body text-sm text-bs-pink hover:underline">
            View all →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left font-body text-sm">
            <thead>
              <tr className="border-b border-white/10 text-bs-white/50">
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Event</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Registered</th>
              </tr>
            </thead>
            <tbody>
              {!loading && recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-bs-white/50">
                    No registrations yet.
                  </td>
                </tr>
              )}
              {recent.map((r) => (
                <tr key={r.id} className="border-b border-white/5 text-white/90">
                  <td className="py-3 pr-4">
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-bs-white/50">{r.email}</p>
                  </td>
                  <td className="py-3 pr-4">{r.events?.name ?? "—"}</td>
                  <td className="py-3 pr-4">
                    <Badge color={statusColor[r.status] ?? "gray"}>{r.status}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-bs-white/60">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
