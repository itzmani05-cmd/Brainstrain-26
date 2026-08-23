import NeonButton from "../NeonButton";
import CountdownTimer from "../CountdownTimer";
import { CalendarIcon, LocationIcon } from "../icons";
import bgHero from "../../assets/bg-hero.webp";

const EVENT_DATE = new Date("2026-09-19T00:00:00");

export default function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center overflow-hidden bg-cover bg-center px-4 pb-24 pt-26 text-center sm:px-6 sm:pt-20 lg:px-8 lg:pb-32 lg:pt-24 2xl:pb-40 2xl:pt-28 4xl:pb-56 4xl:pt-40 6xl:pb-72 6xl:pt-56"
      style={{ backgroundImage: `url(${bgHero})` }}
    >
      <p
        className="text-glow-orange animate-hero-in font-body text-sm font-semibold tracking-[0.1em] text-white sm:text-xl sm:tracking-[0.1em] lg:text-2xl 2xl:text-3xl 4xl:text-4xl 6xl:text-5xl"
        style={{ animationDelay: "0ms" }}
      >
        THE LITERARY AND DEBATING SOCIETY
      </p>
      <p
        className="animate-hero-in mb-10 mt-2 font-body text-xs tracking-[0.2em] text-white sm:text-base lg:text-lg 2xl:text-xl 4xl:text-2xl 6xl:text-3xl"
        style={{ animationDelay: "80ms" }}
      >
        PRESENTS
      </p>

      <div
        className="animate-hero-in relative mt-3 px-6 py-6 sm:px-8 sm:py-4 lg:px-14 lg:py-5 2xl:px-20 2xl:py-8 4xl:px-28 4xl:py-12 6xl:px-40 6xl:py-16"
        style={{ animationDelay: "180ms" }}
      >
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
        <h1 className="font-script -mt-12 text-glow-white relative -rotate-13 text-2xl leading-none text-white drop-shadow-[1px_5px_4px_rgba(0,0,0,0.8)] sm:text-6xl md:text-[8rem] lg:text-[9rem] 2xl:text-[11rem] 4xl:text-[14rem] 6xl:text-[18rem]">
          Brainstrain
          <span className="-ml-[0.9em] -pt-15 text-9xl text-[1em] inline-block translate-y-[0.8em] text-white sm:text-6xl md:text-[4rem] lg:text-[5rem] 2xl:text-[6rem] 4xl:text-[8rem] 6xl:text-[10rem]">
            &lsquo;26
          </span>
        </h1>
      </div>

      <div
        className="animate-hero-in mt-4 flex flex-wrap items-center justify-center gap-3 rounded-full border border-white/25 bg-black/30 px-5 py-2 font-body text-[3px] tracking-wide text-white backdrop-blur-sm sm:text-base lg:gap-4 lg:px-6 lg:py-2 lg:text-lg 2xl:px-9 2xl:py-4 2xl:text-xl 4xl:px-12 4xl:py-5 4xl:text-2xl 6xl:px-16 6xl:py-6 6xl:text-3xl"
        style={{ animationDelay: "300ms" }}
      >
        <span className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 lg:h-5 lg:w-5 2xl:h-6 2xl:w-6 4xl:h-8 4xl:w-8 6xl:h-10 6xl:w-10" />
          19 SEPT 2026
        </span>
        <span className="text-white/40">|</span>
        <span className="flex items-center gap-2">
          <LocationIcon className="h-4 w-4 lg:h-5 lg:w-5 2xl:h-6 2xl:w-6 4xl:h-8 4xl:w-8 6xl:h-10 6xl:w-10" />
          GCT, COIMBATORE
        </span>
      </div>

      <div className="animate-hero-in mt-6 lg:mt-6 2xl:mt-14 4xl:mt-20 6xl:mt-28" style={{ animationDelay: "380ms" }}>
        <CountdownTimer target={EVENT_DATE} />
      </div>

      <div
        className="animate-hero-in mt-10 flex flex-col gap-4 sm:flex-row lg:mt-10 lg:gap-6 2xl:mt-16 2xl:gap-8 4xl:mt-24 4xl:gap-10 6xl:mt-32 6xl:gap-14"
        style={{ animationDelay: "560ms" }}
      >
        <NeonButton
          to="/register"
          color="pink"
          className="animate-pulse-glow bg-black/40 lg:px-7 lg:py-3.5 lg:text-lg 2xl:px-9 2xl:py-4 2xl:text-xl 4xl:px-12 4xl:py-5 4xl:text-2xl 6xl:px-16 6xl:py-7 6xl:text-4xl"
        >
          REGISTER NOW
        </NeonButton>
        <NeonButton
          to="/events"
          color="blue"
          className="bg-black/40 lg:px-7 lg:py-3.5 lg:text-lg 2xl:px-9 2xl:py-4 2xl:text-xl 4xl:px-12 4xl:py-5 4xl:text-2xl 6xl:px-16 6xl:py-7 6xl:text-4xl"
        >
          EXPLORE EVENTS
        </NeonButton>
      </div>
    </section>
  );
}
