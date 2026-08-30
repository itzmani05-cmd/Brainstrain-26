import NeonButton from "../NeonButton";
import ScriptHeading from "../ScriptHeading";
import Reveal from "../Reveal";
import bgGridSun from "../../assets/About-bg.png";

export default function AboutSection() {
  return (
    <section className="relative flex min-h-[100svh] w-full max-w-full flex-col justify-center overflow-hidden bg-gradient-to-b from-bs-plum via-bs-ink to-bs-black px-5 py-24 sm:px-6 md:block md:min-h-0 md:bg-none md:px-0 md:py-0 md:pt-64 4xl:pt-96 6xl:pt-[32rem]">
      <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-bs-orange/15 blur-[110px] md:hidden" />

      <img
        src={bgGridSun}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover object-[70%_10%] md:block"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bs-black/10 via-transparent to-bs-black" />

      <div className="relative mx-auto flex max-w-7xl flex-col md:pl-16 md:flex-row 4xl:max-w-[120rem] 4xl:pl-32">
        <Reveal className="w-full text-center md:relative md:-top-5 md:w-1/2 md:text-left">
          <ScriptHeading as="h2">About Us</ScriptHeading>

          <p className="mx-auto mt-4 max-w-xl text-[clamp(0.9375rem,4vw,1.375rem)] font-body leading-snug text-bs-white/90 sm:mt-6 sm:text-lg sm:leading-relaxed md:mx-0 4xl:max-w-3xl 4xl:text-3xl 6xl:max-w-4xl 6xl:text-4xl">
            Brainstrain is an inter-collegiate literary fest hosted by the
            Literary and Debating Society of the Government College of
            Technology, Coimbatore. This fest features a multitude of
            literary events designed to bring out the hidden talents of
            participants while serving as a platform to connect like-minded
            individuals from diverse geographical backgrounds.
          </p>

          <div className="mt-6 sm:mt-8 4xl:mt-14">
            <NeonButton
              to="/team"
              color="blue"
              className="w-[min(75%,260px)] min-h-[50px] mx-auto md:w-auto md:mx-0 4xl:px-12 4xl:py-5 4xl:text-2xl 6xl:px-16 6xl:py-7 6xl:text-4xl"
            >
              OUR TEAM
            </NeonButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}