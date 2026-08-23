import NeonButton from "../NeonButton";
import ScriptHeading from "../ScriptHeading";
import Reveal from "../Reveal";
import bgGridSun from "../../assets/About-bg.png";
import bsLogo from "../../assets/bs-logo.png";

export default function AboutSection() {
  return (
    <section className="relative pt-64">
      <div className="relative mx-auto flex max-w-7xl flex-col pl-16 md:flex-row">
        <Reveal className="relative -top-5 w-full text-center md:w-1/2 md:text-left">
          <ScriptHeading as="h2">About Us</ScriptHeading>

          <p className="mt-6 max-w-xl font-body text-base leading-relaxed text-bs-white/90 sm:text-lg">
            Brainstrain is an inter-collegiate literary fest hosted by the
            Literary and Debating Society of the Government College of
            Technology, Coimbatore. This fest features a multitude of
            literary events designed to bring out the hidden talents of
            participants while serving as a platform to connect like-minded
            individuals from diverse geographical backgrounds.
          </p>

          <div className="mt-8">
            <NeonButton to="/team" color="blue">
              OUR TEAM
            </NeonButton>
          </div>
        </Reveal>

        {/* Mobile Logo */}
        <div className="relative mt-10 flex w-full items-center justify-center md:hidden">
          <div className="relative h-56 w-56 overflow-hidden rounded-full sm:h-88 sm:w-88">
            <img
              src={bgGridSun}
              alt=""
              aria-hidden
              className="pointer-events-none h-full w-full object-cover object-[45%_20%]"
            />

            <img
              src={bsLogo}
              alt=""
              aria-hidden
              className="absolute inset-0 z-10 m-auto h-25 w-25 object-contain drop-shadow-[0_0_45px_rgba(255,140,60,0.55)] sm:h-20 sm:w-20"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
