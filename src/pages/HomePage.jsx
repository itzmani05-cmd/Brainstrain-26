import PublicLayout from "../components/PublicLayout";
import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import ExploreEventsSection from "../components/home/ExploreEventsSection";
import useSeo, { SITE_NAME, SITE_URL } from "../hooks/useSeo";
import faqs from "../data/faqs";

const DESCRIPTION =
  "Brainstrain '26 — the inter-collegiate literary fest by the Literary and Debating Society, GCT Coimbatore. September 19, 2026: debate, quiz, drama, poetry, Adzap, and more.";

export default function HomePage() {
  useSeo({
    title: `${SITE_NAME} — Inter-Collegiate Literary Fest | GCT Coimbatore`,
    description: DESCRIPTION,
    path: "/",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Event",
        name: SITE_NAME,
        description: DESCRIPTION,
        startDate: "2026-09-19",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: "Government College of Technology, Coimbatore",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Coimbatore",
            addressRegion: "Tamil Nadu",
            addressCountry: "IN",
          },
        },
        image: [`${SITE_URL}/og-image.webp`],
        organizer: {
          "@type": "Organization",
          name: "Literary and Debating Society, GCT Coimbatore",
          url: SITE_URL,
        },
        url: SITE_URL,
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  });

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