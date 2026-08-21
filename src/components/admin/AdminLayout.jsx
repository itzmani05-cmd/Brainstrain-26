import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import bsLogo from "../../assets/bs-logo.png";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/admin/events", label: "Events", icon: "🎭" },
  { to: "/admin/registrations", label: "Registrations", icon: "📝" },
  { to: "/admin/teams", label: "Teams", icon: "👥" },
  { to: "/admin/participants", label: "Participants", icon: "🧑‍🎓" },
];

export default function AdminLayout({ children }) {
  const { profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 font-body text-sm tracking-wide transition ${
      isActive
        ? "bg-bs-pink/15 text-white shadow-[0_0_10px_rgba(209,58,170,0.4)] border border-bs-pink/50"
        : "text-bs-white/70 hover:bg-white/5 hover:text-white"
    }`;

  const Sidebar = (
    <div className="flex h-full flex-col bg-bs-ink/95 px-4 py-6">
      <Link to="/admin/dashboard" className="mb-8 flex items-center gap-3 px-2">
        <img src={bsLogo} alt="" className="h-9 w-9" />
        <div>
          <p className="font-script text-glow-white text-xl leading-none text-white">Brainstrain</p>
          <p className="font-body text-[10px] tracking-[0.3em] text-bs-white/50">ADMIN PANEL</p>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={navItemClass} onClick={() => setMobileOpen(false)}>
            <span>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>

      <Link
        to="/"
        className="mb-2 rounded-lg px-4 py-2 font-body text-sm text-bs-white/60 transition hover:text-white"
      >
        ← View public site
      </Link>

      <div className="mt-2 rounded-lg border border-white/10 p-3">
        <p className="truncate font-body text-sm text-white">{profile?.name || profile?.email}</p>
        <p className="font-body text-xs text-bs-pink">Administrator</p>
        <button
          type="button"
          onClick={signOut}
          className="mt-2 w-full rounded-md border border-white/20 py-1.5 font-body text-xs text-bs-white/80 transition hover:border-bs-pink hover:text-white"
        >
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-bs-black text-white">
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(209,58,170,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(209,58,170,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative flex">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 lg:block">
          <div className="sticky top-0 h-screen">{Sidebar}</div>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-72 border-r border-white/10">{Sidebar}</div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-white/10 bg-bs-black/80 px-4 py-4 backdrop-blur lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-md border border-white/20 px-3 py-1.5 font-body text-sm text-white"
            >
              ☰ Menu
            </button>
            <span className="font-script text-glow-white text-xl text-white">Brainstrain</span>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
