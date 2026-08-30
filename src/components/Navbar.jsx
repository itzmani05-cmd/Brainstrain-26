import { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import logo from "../assets/BS-logo-navbar.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/team", label: "Team" },
  { to: "/#contact", label: "Contact", hash: true },
  { to: "/register", label: "Register" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    `font-body text-base tracking-wide transition-colors 4xl:text-xl 6xl:text-2xl 7xl:text-3xl ${
      isActive ? "text-bs-orange text-glow-orange" : "text-white hover:text-bs-orange"
    }`;
  const visibleLinks = links.filter((l) => l.to !== "/#contact" || pathname === "/");
  const solidBg =
    pathname.startsWith("/team") || pathname.startsWith("/events") || pathname.startsWith("/register");
  const navBg = solidBg
    ? "bg-bs-black"
    : scrolled
      ? "bg-bs-black/70 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
      : "bg-transparent";

  return (
    <header
      className={`animate-nav-in fixed top-0 left-0 z-50 w-full transition-colors duration-300 ${navBg}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 4xl:max-w-[120rem] 4xl:px-12 4xl:py-6 6xl:max-w-[160rem] 6xl:px-20 6xl:py-8 7xl:max-w-[200rem] 7xl:px-28 7xl:py-10">
        <NavLink to="/" className="group flex min-w-0 items-center gap-2 sm:gap-3" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="Brainstrain"
            className="h-8 w-8 shrink-0 object-contain transition-transform duration-500 group-hover:rotate-[360deg] sm:h-9 sm:w-9 4xl:h-14 4xl:w-14 6xl:h-20 6xl:w-20 7xl:h-24 7xl:w-24"
          />
          <span className="font-script truncate text-xl text-bs-white sm:text-2xl md:text-3xl 4xl:text-5xl 6xl:text-6xl 7xl:text-7xl">
            Brainstrain &lsquo;26
          </span>
        </NavLink>

        <nav className="hidden items-center gap-10 md:flex 4xl:gap-16 6xl:gap-20 7xl:gap-24">
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
        className={`grid bg-bs-black/95 transition-[grid-template-rows] duration-300 ease-out md:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <nav
          className={`flex flex-col gap-1 overflow-hidden px-4 transition-[opacity,padding] duration-300 ease-out ${
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
