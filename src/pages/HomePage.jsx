import PublicLayout from "../components/PublicLayout";
import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import ExploreEventsSection from "../components/home/ExploreEventsSection";

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroSection />

      <div className="relative overflow-hidden bg-bs-ink">
        <AboutSection />
        <ExploreEventsSection />
      </div>
    </PublicLayout>
  );
}