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

        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-6 px-4 sm:gap-8 4xl:max-w-6xl 4xl:gap-12 6xl:max-w-7xl 6xl:gap-16 7xl:max-w-[100rem] 7xl:gap-20">
          {events.map((ev, i) => (
            <Reveal
              key={ev.slug}
              delay={i * 80}
              className="w-[calc(50%-0.75rem)] sm:w-[calc(33.333%-1.5rem)] lg:w-[calc(25%-1.5rem)]"
            >
              <Link to={`/events/${ev.slug}`} className="group flex flex-col items-center gap-4 text-center">
                <div className="h-32 w-32 overflow-hidden rounded-[30px] border-2 border-white bg-black shadow-[0_0_15.7px_8px_#491c55] transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_12px_#7a2f8f] sm:h-44 sm:w-44 4xl:h-56 4xl:w-56 6xl:h-64 6xl:w-64 7xl:h-72 7xl:w-72">
                  {resolveEventImage(ev.image_url) ? (
                    <img
                      src={resolveEventImage(ev.image_url)}
                      alt={ev.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <span className="font-body text-lg font-medium uppercase tracking-wide text-bs-white/90 transition group-hover:text-white sm:text-2xl 4xl:text-3xl 6xl:text-4xl 7xl:text-5xl">
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
