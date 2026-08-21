import { useRef } from "react";

export default function TeamRow({ title, members }) {
  const scrollerRef = useRef(null);

  function scroll(dir) {
    scrollerRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  }

  return (
    <div className="mb-14">
      <h3 className="text-glow-pink mb-6 text-center font-body text-lg font-semibold tracking-[0.3em] text-white sm:text-2xl">
        {title.toUpperCase()}
      </h3>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-bs-pink sm:flex"
        >
          ‹
        </button>

        <div
          ref={scrollerRef}
          className="scrollbar-none flex flex-1 gap-8 overflow-x-auto scroll-smooth px-2 py-2"
        >
          {members.map((m, i) => (
            <div
              key={i}
              className="group flex w-24 shrink-0 flex-col items-center gap-3 text-center sm:w-28"
            >
              <div className="h-20 w-20 rounded-full border-2 border-bs-pink/60 bg-gradient-to-br from-[#7a1f2b] to-[#3d0f16] shadow-[0_0_12px_rgba(209,58,170,0.5)] transition duration-300 group-hover:scale-110 group-hover:border-bs-pink group-hover:shadow-[0_0_20px_rgba(209,58,170,0.85)] sm:h-24 sm:w-24" />
              <div>
                <p className="font-body text-xs font-semibold uppercase leading-tight text-white sm:text-sm">
                  {m.name}
                </p>
                <p className="font-body text-[11px] text-bs-white/60 sm:text-xs">{m.role}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-bs-pink sm:flex"
        >
          ›
        </button>
      </div>
    </div>
  );
}
