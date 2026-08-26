import { Link } from "react-router-dom";
import ScriptHeading from "../ScriptHeading";
import Reveal from "../Reveal";
import events from "../../data/events";
import { resolveEventImage } from "../../data/eventImages";

export default function ExploreEventsSection() {
  return (
    <section className="relative py-20">
      <div className="bg-grid-fade absolute inset-0 bg-gradient-to-b from-bs-black via-[#1a0f24] to-bs-black md:hidden" />

      <div className="relative">
        <Reveal>
          <ScriptHeading as="h2" className="mb-14 text-center">
            Explore Events
          </ScriptHeading>
        </Reveal>

        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {events.map((ev, i) => (
            <Reveal key={ev.slug} delay={i * 60}>
              <Link
                to={`/events/${ev.slug}`}
                className="group flex h-full flex-col items-center gap-3 rounded-[24px] border-2 border-white/20 bg-black/30 p-3 text-center shadow-[4px_4px_10px_rgba(0,0,0,0.25)] transition duration-300 hover:scale-105 hover:border-white hover:shadow-[0_0_15.7px_8px_#491c55] sm:gap-4 sm:p-4"
              >
                <div className="aspect-square w-full max-w-[9rem] overflow-hidden rounded-2xl border-2 border-white bg-black sm:max-w-[10rem]">
                  {resolveEventImage(ev.image_url) ? (
                    <img
                      src={resolveEventImage(ev.image_url)}
                      alt={ev.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <span className="font-body text-sm font-medium uppercase tracking-wide text-bs-white/90 transition group-hover:text-white sm:text-lg lg:text-xl">
                  {ev.name}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
