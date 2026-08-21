import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import NeonButton from "../components/NeonButton";
import ScriptHeading from "../components/ScriptHeading";
import Reveal from "../components/Reveal";
import { supabase } from "../lib/supabaseClient";
import { resolveEventImage } from "../data/eventImages";
import bgHero from "../assets/bg-hero.webp";
import bgGridSun from "../assets/bg-grid-sun.webp";
import bsLogo from "../assets/bs-logo.png";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [index, setIndex] = useState(0);
  const scrollerRef = useRef(null);

  useEffect(() => {
    let active = true;
    supabase
      .from("events")
      .select("id, name, slug, image_url, is_active")
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error(error.message);
          return;
        }
        setEvents(data ?? []);
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
      });
    return () => {
      active = false;
    };
  }, []);

  const visibleCount = 3;
  const canScroll = events.length > visibleCount;

  function scrollBy(dir) {
    if (!events.length) return;
    setIndex((i) => {
      const next = i + dir;
      if (next < 0) return Math.max(0, events.length - visibleCount);
      if (next > events.length - visibleCount) return 0;
      return next;
    });
  }

  return (
    <PublicLayout>
      {/* HERO */}
      <section
        className="relative flex flex-col items-center overflow-hidden bg-cover bg-center px-4 pb-24 pt-16 text-center sm:pt-20"
        style={{ backgroundImage: `url(${bgHero})` }}
      >
        <p
          className="text-glow-orange animate-hero-in font-body text-sm font-semibold tracking-[0.4em] text-white sm:text-2xl sm:tracking-[0.5em]"
          style={{ animationDelay: "0ms" }}
        >
          THE LITERARY AND DEBATING SOCIETY
        </p>
        <p
          className="animate-hero-in mt-2 font-body text-xs tracking-[0.4em] text-white sm:text-base"
          style={{ animationDelay: "80ms" }}
        >
          PRESENTS
        </p>

        <div className="animate-hero-in relative mt-6 px-6 py-3 sm:px-10 sm:py-5" style={{ animationDelay: "180ms" }}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(to bottom, #ff6c36, #a9214e 48%, #d13aaa)",
              WebkitMaskImage:
                "repeating-linear-gradient(to bottom, black 0px, black 5px, transparent 5px, transparent 11px)",
              maskImage:
                "repeating-linear-gradient(to bottom, black 0px, black 5px, transparent 5px, transparent 11px)",
            }}
          />
          <h1 className="font-script text-glow-white relative text-6xl leading-none text-white drop-shadow-[1px_5px_4px_rgba(0,0,0,0.8)] sm:text-8xl md:text-[10rem]">
            Brainstrain &lsquo;26
          </h1>
        </div>

        <div className="animate-hero-in mt-10 flex flex-col gap-4 sm:flex-row" style={{ animationDelay: "560ms" }}>
          <NeonButton to="/register" color="pink" className="animate-pulse-glow bg-black/40">
            REGISTER NOW
          </NeonButton>
          <NeonButton to="/events" color="blue" className="bg-black/40">
            EXPLORE EVENTS
          </NeonButton>
        </div>
      </section>

      {/* ABOUT */}
      <section
        className="animate-bg-pan relative overflow-hidden bg-bs-ink bg-no-repeat py-24"
        style={{ backgroundImage: `url(${bgGridSun})`, backgroundSize: "130% auto" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-bs-black/20 via-bs-ink/60 to-bs-black" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 md:flex-row md:items-start">
          <Reveal className="flex-1 text-center md:text-left">
            <ScriptHeading as="h2">About Us</ScriptHeading>
            <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-bs-white/90 sm:text-lg">
              Brainstrain is an inter-collegiate literary fest hosted by the Literary and Debating
              Society of the Government College of Technology, Coimbatore. This fest features a
              multitude of literary events designed to bring out the hidden talents of participants
              while serving as a platform to connect like-minded individuals from diverse
              geographical backgrounds.
            </p>
            <div className="mt-8">
              <NeonButton to="/team" color="blue">
                OUR TEAM
              </NeonButton>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <img
              src={bsLogo}
              alt=""
              aria-hidden
              className="animate-float h-48 w-48 shrink-0 opacity-90 sm:h-64 sm:w-64"
            />
          </Reveal>
        </div>
      </section>

      {/* EXPLORE EVENTS */}
      <section className="bg-grid-fade relative bg-gradient-to-b from-bs-black via-[#1a0f24] to-bs-black py-20">
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

          <div ref={scrollerRef} className="grid flex-1 grid-cols-2 gap-6 sm:grid-cols-3 md:gap-10">
            {(events.length ? events : Array.from({ length: 3 })).slice(index, index + visibleCount).map((ev, i) =>
              ev ? (
                <Reveal key={ev.id} delay={i * 100}>
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
    </PublicLayout>
  );
}
