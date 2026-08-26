import { useEffect, useState } from "react";

function getVisibleCount() {
  if (typeof window === "undefined") return 4;
  const w = window.innerWidth;
  if (w < 480) return 1;
  if (w < 768) return 2;
  if (w < 1024) return 3;
  return 4;
}

export default function TeamRow({ title, members }) {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(getVisibleCount);

  useEffect(() => {
    function onResize() {
      setVisibleCount(getVisibleCount());
      setIndex(0);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const canSlide = members.length > visibleCount;

  function move(dir) {
    if (!canSlide) return;
    const max = members.length - visibleCount;
    setIndex((i) => {
      const next = i + dir;
      if (next < 0) return max;
      if (next > max) return 0;
      return next;
    });
  }

  return (
    <div className="mb-14 w-full items-center flex flex-col gap-2 sm:*: text-center">
      <h3 className="text-glow-pink mb-6 font-body text-lg font-semibold tracking-[0.3em] text-white sm:text-2xl">
        {title.toUpperCase()}
      </h3>

      <div className="flex w-full items-center gap-2">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Previous members"
          disabled={!canSlide}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-bs-pink disabled:cursor-not-allowed disabled:opacity-30"
        >
          ‹
        </button>

        <div className="flex-1 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * (100 / visibleCount)}%)` }}
          >
            {members.map((m, i) => (
              <div
                key={i}
                className="flex shrink-0 flex-col items-center gap-3 py-10 px-2 text-center"
                style={{ flex: `0 0 ${100 / visibleCount}%` }}
              >
                <div
                  className="h-36 w-36 rounded-full border-2 border-bs-pink/60 bg-gradient-to-br from-[#7a1f2b] to-[#3d0f16] bg-cover bg-center shadow-[0_0_12px_rgba(209,58,170,0.5)] transition duration-300 hover:scale-110 hover:border-bs-pink hover:shadow-[0_0_20px_rgba(209,58,170,0.85)] sm:h-32 sm:w-32"
                  style={
                    m.photo
                      ? { backgroundImage: `url(${m.photo})`, backgroundPosition: m.focus || "center" }
                      : undefined
                  }
                />
                <div>
                  <p className="font-body text-center text-base font-semibold uppercase leading-tight text-white sm:text-base">
                    {m.name}
                  </p>
                  <p className="font-body text-sm text-bs-white/60 sm:text-sm">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Next members"
          disabled={!canSlide}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-bs-pink disabled:cursor-not-allowed disabled:opacity-30"
        >
          ›
        </button>
      </div>
    </div>
  );
}