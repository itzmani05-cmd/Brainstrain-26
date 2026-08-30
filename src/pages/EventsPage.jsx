import PublicLayout from "../components/PublicLayout";
import PageBackdrop from "../components/PageBackdrop";
import ScriptHeading from "../components/ScriptHeading";
import EventList from "../components/events/EventList";
import events from "../data/events";
import bgHero from "../assets/bg-hero.webp";
import useSeo, { SITE_NAME, SITE_URL } from "../hooks/useSeo";

export default function EventsPage() {
  useSeo({
    title: `Events | ${SITE_NAME}`,
    description:
      "Explore every event at Brainstrain '26 — debate, quiz, drama, poetry, Adzap, and more. GCT Coimbatore's inter-collegiate literary fest on September 19, 2026.",
    path: "/events",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: events.map((event, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: event.name,
        url: `${SITE_URL}/events/${event.slug}`,
      })),
    },
  });

  return (
    <PublicLayout>
      <PageBackdrop backgroundImage={bgHero} bgPosition="15% 1%">
        <div className="mx-auto max-w-4xl px-4 pb-24 pt-32 4xl:max-w-6xl 6xl:max-w-7xl 7xl:max-w-[100rem]">
          <ScriptHeading as="h1" className="mb-10 text-center">
            Events
          </ScriptHeading>
          <EventList events={events} />
        </div>
      </PageBackdrop>
    </PublicLayout>
  );
}
