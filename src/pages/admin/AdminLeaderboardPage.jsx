import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageBackdrop from "../../components/PageBackdrop";
import ScriptHeading from "../../components/ScriptHeading";
import { apiUrl } from "../../lib/api";
import useSeo, { SITE_NAME } from "../../hooks/useSeo";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function AdminLeaderboardPage() {
  useSeo({ title: `Leaderboard | ${SITE_NAME}`, path: "/admin/leaderboard", noindex: true });

  const navigate = useNavigate();
  const [colleges, setColleges] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("bs_admin_token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetch(apiUrl("/api/college-points"), { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("bs_admin_token");
          navigate("/admin/login");
          return null;
        }
        if (!res.ok) throw new Error("Failed to load leaderboard");
        return res.json();
      })
      .then((body) => {
        if (body) setColleges(body.colleges);
      })
      .catch((err) => setError(err.message));
  }, [navigate]);

  return (
    <PageBackdrop>
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-32">
        <Link
          to="/admin"
          className="mb-4 inline-block font-body text-xs tracking-wide text-white/50 hover:text-white"
        >
          ← ALL REGISTRATIONS
        </Link>

        <ScriptHeading as="h1" className="mb-4 text-center">
          Leaderboard
        </ScriptHeading>
        <p className="mx-auto mb-10 max-w-xl text-center font-body text-sm text-bs-white/60">
          1 pt participation · 2 pts advancing to the next round · 3 pts runner-up · 5 pts
          winner
        </p>

        {error && <p className="text-center font-body text-sm text-red-400">{error}</p>}

        {!colleges && !error && (
          <p className="text-center font-body text-bs-white/60">Loading…</p>
        )}

        {colleges && colleges.length === 0 && (
          <p className="text-center font-body text-bs-white/60">
            No points recorded yet — check back once events are underway.
          </p>
        )}

        {colleges && colleges.length > 0 && (
          <div className="glass-card overflow-x-auto rounded-[24px] p-4 sm:p-6">
            <table className="w-full min-w-[480px] border-collapse font-body text-sm text-white/90">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-white/50">
                  <th className="px-3 py-3">#</th>
                  <th className="px-3 py-3">College</th>
                  <th className="px-3 py-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {colleges.map((c, i) => (
                  <tr key={c.collegeName} className="border-b border-white/5">
                    <td className="px-3 py-3 text-white/60">{MEDALS[i] || i + 1}</td>
                    <td className="px-3 py-3 font-semibold text-white">
                      {c.collegeName}
                      <p className="font-body text-xs font-normal text-white/40">
                        {c.participations} participated · {c.advances} advanced · {c.wins} won ·{" "}
                        {c.runnerUps} runner-up
                      </p>
                    </td>
                    <td className="px-3 py-3 text-right text-glow-blue text-xl font-semibold text-bs-blue">
                      {c.points}
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
