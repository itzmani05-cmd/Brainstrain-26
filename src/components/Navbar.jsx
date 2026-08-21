import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/bs-logo.png";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/events", label: "Events" },
  { to: "/register", label: "Register" },
  { to: "/team", label: "Team" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `relative font-body text-base tracking-wide transition-colors after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-bs-pink after:shadow-[0_0_6px_#d13aaa] after:transition-transform after:duration-300 ${
      isActive
        ? "text-bs-pink text-glow-pink after:scale-x-100"
        : "text-white hover:text-bs-pink hover:after:scale-x-100"
    }`;

  return (
    <header className="animate-nav-in sticky top-0 z-50 bg-bs-black/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
        <NavLink to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="Brainstrain"
            className="h-9 w-9 object-contain transition-transform duration-500 group-hover:rotate-[360deg]"
          />
          <span className="font-script text-glow-white text-2xl text-bs-white sm:text-3xl">
            Brainstrain &lsquo;26
          </span>
        </NavLink>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label.toUpperCase()}
            </NavLink>
          ))}
          <a
            href="/#contact"
            className="relative font-body text-base tracking-wide text-white transition-colors after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-bs-pink after:shadow-[0_0_6px_#d13aaa] after:transition-transform after:duration-300 hover:text-bs-pink hover:after:scale-x-100"
          >
            CONTACT
          </a>
        </nav>

        <button
          type="button"
          className="flex flex-col gap-1.5 md:hidden"
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
          className={`flex flex-col gap-1 overflow-hidden border-t border-white/10 bg-bs-black/95 px-4 transition-[opacity,padding] duration-300 ease-out ${
            open ? "pb-6 pt-2 opacity-100" : "pb-0 pt-0 opacity-0"
          }`}
        >
          {links.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `font-body text-base tracking-wide transition-colors ${
                  isActive ? "text-bs-pink text-glow-pink" : "text-white hover:text-bs-pink"
                }`
              }
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
          ))}
          <a
            href="/#contact"
            className="font-body text-base tracking-wide text-white transition-colors hover:text-bs-pink"
            onClick={() => setOpen(false)}
          >
            <span
              className={`block py-3 transition-all duration-300 ${
                open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${links.length * 60}ms` : "0ms" }}
            >
              CONTACT
            </span>
          </a>
        </nav>
      </div>
    </header>
  );
}
