import { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import logo from "../assets/bs-logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/team", label: "Team" },
  { to: "/#contact", label: "Contact", hash: true },
  { to: "/register", label: "Register" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const linkClass = ({ isActive }) =>
    `font-body text-base tracking-wide transition-colors ${
      isActive ? "text-bs-orange text-glow-orange" : "text-white hover:text-bs-orange"
    }`;
  const visibleLinks = links.filter((l) => l.to !== "/#contact" || pathname === "/");

  return (
    <header className="animate-nav-in fixed top-0 left-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <NavLink to="/" className="group flex min-w-0 items-center gap-2 sm:gap-3" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="Brainstrain"
            className="h-8 w-8 shrink-0 object-contain transition-transform duration-500 group-hover:rotate-[360deg] sm:h-9 sm:w-9"
          />
          <span className="font-script  truncate text-xl text-bs-white sm:text-2xl md:text-3xl">
            Brainstrain &lsquo;26
          </span>
        </NavLink>

        <nav className="hidden items-center gap-10 md:flex">
          {visibleLinks.map((l) =>
            l.hash ? (
              <a key={l.to} href={l.to} className={linkClass({ isActive: false })}>
                {l.label.toUpperCase()}
              </a>
            ) : (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} className={linkClass}>
                {l.label.toUpperCase()}
              </NavLink>
            )
          )}
        </nav>

        <button
          type="button"
          className="flex shrink-0 flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`h-0.5 w-7 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-7 bg-white transition ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-7 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out md:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <nav
          className={`flex flex-col gap-1 overflow-hidden border-t border-white/10 px-4 transition-[opacity,padding] duration-300 ease-out ${
            open ? "pb-6 pt-2 opacity-100" : "pb-0 pt-0 opacity-0"
          }`}
        >
          {visibleLinks
            .filter((l) => l.to !== "/register")
            .map((l, i) =>
              l.hash ? (
                <a
                  key={l.to}
                  href={l.to}
                  onClick={() => setOpen(false)}
                  className={linkClass({ isActive: false })}
                  style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
                >
                  <span
                    className={`block py-3 transition-all duration-300 ${
                      open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                    }`}
                    style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
                  >
                    {l.label.toUpperCase()}
                  </span>
                </a>
              ) : (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  className={linkClass}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
                >
                  <span
                    className={`block py-3 transition-all duration-300 ${
                      open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                    }`}
                    style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
                  >
                    {l.label.toUpperCase()}
                  </span>
                </NavLink>
              )
            )}
          <NavLink
            to="/register"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-lg border border-white px-5 py-3 text-center font-body text-white shadow-[0_0_3.45px_#d13aaa] transition hover:scale-[1.02]"
          >
            REGISTER
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
