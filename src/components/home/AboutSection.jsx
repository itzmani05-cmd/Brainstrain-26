import NeonButton from "../NeonButton";
import ScriptHeading from "../ScriptHeading";
import Reveal from "../Reveal";
import bgGridSun from "../../assets/About-bg.png";
import bsLogo from "../../assets/bs-logo.png";

export default function AboutSection() {
  return (
    <section className="relative w-full max-w-full overflow-x-hidden px-5 pt-20 sm:px-6 sm:pt-28 md:px-0 md:pt-64">
      <div className="relative mx-auto flex max-w-7xl flex-col md:pl-16 md:flex-row">
        <Reveal className="w-full text-center md:relative md:-top-5 md:w-1/2 md:text-left">
          <ScriptHeading as="h2">About Us</ScriptHeading>

          <p className="mx-auto mt-6 max-w-xl text-[clamp(1rem,4.5vw,1.375rem)] font-body leading-relaxed text-bs-white/90 sm:text-lg md:mx-0">
            Brainstrain is an inter-collegiate literary fest hosted by the
            Literary and Debating Society of the Government College of
            Technology, Coimbatore. This fest features a multitude of
            literary events designed to bring out the hidden talents of
            participants while serving as a platform to connect like-minded
            individuals from diverse geographical backgrounds.
          </p>

          <div className="mt-8">
            <NeonButton to="/team" color="blue" className="w-[min(75%,260px)] min-h-[50px] mx-auto md:w-auto md:mx-0">
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
              className="pointer-events-none h-full w-full object-cover object-[65%_15%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
