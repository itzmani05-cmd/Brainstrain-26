import PublicLayout from "../components/PublicLayout";
import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import ExploreEventsSection from "../components/home/ExploreEventsSection";
import aboutEventsBg from "../assets/About-bg.png";

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroSection />

      <div className="relative overflow-hidden bg-bs-ink">
        <img
          src={aboutEventsBg}
          alt=""
          aria-hidden
          className="animate-bg-pan pointer-events-none absolute inset-0 hidden h-full w-full object-cover object-[70%_10%] md:block"
        />
        <div className="absolute inset-0 hidden bg-gradient-to-b from-bs-black/10 via-transparent to-bs-black md:block" />

        <div className="relative">
          <AboutSection />
          <ExploreEventsSection />
        </div>
      </div>
    </PublicLayout>
  );
}
