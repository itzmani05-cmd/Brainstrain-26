import { useState } from "react";
import EventCard from "../EventCard";
import Reveal from "../Reveal";

const PER_PAGE = 4;

export default function EventList({ events }) {
  const [page, setPage] = useState(0);

  if (events.length === 0) {
    return (
      <p className="text-center font-body text-bs-white/70">
        Events will be announced here soon.
      </p>
    );
  }

  const totalPages = Math.ceil(events.length / PER_PAGE);
  const start = page * PER_PAGE;
  const visibleEvents = events.slice(start, start + PER_PAGE);

  function goTo(p) {
    const clamped = Math.max(0, Math.min(totalPages - 1, p));
    setPage(clamped);
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-8">
        {visibleEvents.map((ev, i) => (
          <Reveal key={ev.slug} delay={Math.min(i, 5) * 80}>
            <EventCard event={ev} />
          </Reveal>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white transition hover:scale-110 hover:border-bs-pink disabled:opacity-30 disabled:hover:scale-100 disabled:hover:border-white/40"
            aria-label="Previous page"
          >
            ‹
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Page ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === page ? "bg-bs-pink" : "bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white transition hover:scale-110 hover:border-bs-pink disabled:opacity-30 disabled:hover:scale-100 disabled:hover:border-white/40"
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}