import { useState } from "react";
import PublicLayout from "../components/PublicLayout";
import CountdownTimer from "../components/CountdownTimer";
import Reveal from "../components/Reveal";
import heroBg from "../assets/figma/hero-bg.png";
import heroTypo from "../assets/figma/hero-typo-lockup.png";
import batsPattern from "../assets/figma/bats-pattern.png";
import avatarPerson from "../assets/figma/avatar-person.svg";
import arrowLeft from "../assets/figma/arrow-left.svg";
import arrowRight from "../assets/figma/arrow-right.svg";
import bsLogo from "../assets/bs-logo.png";

const EVENT_DATE = new Date("2026-09-19T00:00:00+05:30");

const WEB_TEAM = [
  { name: "Abinesh", role: "Developer" },
  { name: "Saravanavel C", role: "Designer" },
  { name: "Manikandan M", role: "Developer" },
];

export default function HomePage() {
  const [teamOffset, setTeamOffset] = useState(0);

  function cycleTeam(dir) {
    setTeamOffset((o) => (o + dir + WEB_TEAM.length) % WEB_TEAM.length);
  }

  const visibleTeam = [0, 1, 2].map((i) => WEB_TEAM[(teamOffset + i) % WEB_TEAM.length]);

  return (
    <PublicLayout>
      {/* HERO */}
      <section
        className="relative flex flex-col items-center overflow-hidden bg-cover bg-center px-4 pb-20 pt-16 text-center sm:pt-20"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <p
          className="text-glow-white animate-hero-in font-body text-sm font-semibold tracking-[0.4em] text-white sm:text-2xl sm:tracking-[0.5em]"
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

        <img
          src={heroTypo}
          alt="Brainstrain '26"
          className="animate-hero-in mt-6 w-full max-w-[720px]"
          style={{ animationDelay: "180ms" }}
        />

        <div className="animate-hero-in mt-10" style={{ animationDelay: "440ms" }}>
          <CountdownTimer target={EVENT_DATE} />
        </div>
      </section>

      {/* ABOUT */}
      <section
        className="relative overflow-hidden bg-bs-plum bg-cover bg-center bg-no-repeat py-24"
        style={{ backgroundImage: `url(${batsPattern})` }}
      >
        <Reveal className="relative mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-emboss text-3xl font-bold text-bs-white sm:text-4xl">About Us</h2>
        </Reveal>
        <Reveal
          delay={120}
          className="relative mx-auto mt-10 flex max-w-5xl flex-col items-center gap-6 px-4 md:flex-row md:items-stretch"
        >
          <div className="flex w-full shrink-0 items-center justify-center rounded-[30px] bg-[#d9d9d9] p-8 md:w-64">
            <img src={bsLogo} alt="" aria-hidden className="h-32 w-32 object-contain" />
          </div>
          <div className="flex w-full items-center rounded-[30px] bg-[#d9d9d9] p-8 sm:p-10">
            <p className="font-body text-base leading-relaxed text-black sm:text-lg">
              Brainstrain is an inter-collegiate literary fest hosted by the Literary and Debating
              Society of the Government College of Technology, Coimbatore. This fest features a
              multitude of literary events designed to bring out the hidden talents of participants
              while serving as a platform to connect like-minded individuals from diverse
              geographical backgrounds.
            </p>
          </div>
        </Reveal>
      </section>

      {/* WEB TEAM */}
      <section className="relative overflow-hidden bg-gradient-to-b from-bs-maroon via-bs-ink to-bs-black py-20">
        <Reveal>
          <h2 className="font-display text-emboss text-center text-3xl font-bold text-bs-white sm:text-4xl">
            Web Team
          </h2>
        </Reveal>

        <div className="mx-auto mt-14 flex max-w-4xl items-center gap-4 px-4 sm:gap-8">
          <button
            type="button"
            onClick={() => cycleTeam(-1)}
            aria-label="Previous team member"
            className="shrink-0 transition hover:scale-110"
          >
            <img src={arrowLeft} alt="" className="h-10 w-10 sm:h-12 sm:w-12" />
          </button>

          <div className="grid flex-1 grid-cols-3 gap-4 sm:gap-10">
            {visibleTeam.map((member, i) => (
              <Reveal key={`${member.name}-${teamOffset}`} delay={i * 100} className="flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#d9d9d9] shadow-[0_4px_10px_rgba(0,0,0,0.4)] sm:h-[182px] sm:w-[182px]">
                  <img src={avatarPerson} alt="" aria-hidden className="h-2/3 w-2/3 object-contain" />
                </div>
                <div className="text-center">
                  <p className="font-display text-sm font-bold text-bs-white sm:text-2xl">{member.name}</p>
                  <p className="font-display text-xs font-semibold text-bs-white/80 sm:text-lg">{member.role}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <button
            type="button"
            onClick={() => cycleTeam(1)}
            aria-label="Next team member"
            className="shrink-0 transition hover:scale-110"
          >
            <img src={arrowRight} alt="" className="h-10 w-10 sm:h-12 sm:w-12" />
          </button>
        </div>
      </section>
    </PublicLayout>
  );
}
