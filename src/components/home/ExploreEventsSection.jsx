import { useState } from "react";
import { Link } from "react-router-dom";
import NeonButton from "../NeonButton";
import ScriptHeading from "../ScriptHeading";
import Reveal from "../Reveal";
import events from "../../data/events";
import { resolveEventImage } from "../../data/eventImages";

const VISIBLE_COUNT = 3;

export default function ExploreEventsSection() {
  const [index, setIndex] = useState(0);
  const canScroll = events.length > VISIBLE_COUNT;

  function scrollBy(dir) {
    if (!events.length) return;
    setIndex((i) => {
      const next = i + dir;
      if (next < 0) return Math.max(0, events.length - VISIBLE_COUNT);
      if (next > events.length - VISIBLE_COUNT) return 0;
      return next;
    });
  }

  return (
    <section className="bg-grid-fade relative bg-gradient-to-b from-bs-black via-[#1a0f24] to-bs-black py-20 md:bg-none">
      <Reveal>
        <ScriptHeading as="h2" className="mb-14 text-center">
          Explore Events
        </ScriptHeading>
      </Reveal>

      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4">
        {canScroll && (
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous events"
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition hover:scale-110 hover:border-bs-pink sm:flex"
          >
            ‹
          </button>
        )}

        <div className="grid flex-1 grid-cols-2 gap-6 sm:grid-cols-3 md:gap-10">
          {(events.length ? events : Array.from({ length: 3 })).slice(index, index + VISIBLE_COUNT).map((ev, i) =>
            ev ? (
              <Reveal key={ev.slug} delay={i * 100}>
                <Link to={`/events/${ev.slug}`} className="group flex flex-col items-center gap-4 text-center">
                  <div className="h-32 w-32 overflow-hidden rounded-[30px] border-2 border-white bg-black shadow-[0_0_15.7px_8px_#491c55] transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_12px_#7a2f8f] sm:h-44 sm:w-44">
                    {resolveEventImage(ev.image_url) ? (
                      <img
                        src={resolveEventImage(ev.image_url)}
                        alt={ev.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <span className="font-body text-lg font-medium uppercase tracking-wide text-bs-white/90 transition group-hover:text-white sm:text-2xl">
                    {ev.name}
                  </span>
                </Link>
              </Reveal>
            ) : (
              <div key={i} className="h-32 w-32 animate-pulse rounded-[30px] bg-white/5 sm:h-44 sm:w-44" />
            )
          )}
        </div>

        {canScroll && (
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next events"
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition hover:scale-110 hover:border-bs-pink sm:flex"
          >
            ›
          </button>
        )}
      </div>

      <Reveal className="mt-10 text-center">
        <NeonButton to="/events" color="pink">
          VIEW ALL EVENTS
        </NeonButton>
      </Reveal>
    </section>
  );
}
