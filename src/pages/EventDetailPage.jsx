import { useParams } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import PageBackdrop from "../components/PageBackdrop";
import Reveal from "../components/Reveal";
import EventNotFound from "../components/events/EventNotFound";
import EventDescription from "../components/events/EventDescription";
import EventInfoList from "../components/events/EventInfoList";
import EventMetaFooter from "../components/events/EventMetaFooter";
import { getEventBySlug } from "../data/events";
import useSeo, { SITE_NAME, SITE_URL } from "../hooks/useSeo";

export default function EventDetailPage() {
  const { slug } = useParams();
  const event = getEventBySlug(slug);

  useSeo({
    title: event ? `${event.name} | ${SITE_NAME}` : `Event Not Found | ${SITE_NAME}`,
    description: event
      ? event.description
      : "This event doesn't exist. Browse all Brainstrain '26 events.",
    path: `/events/${slug}`,
    noindex: !event,
    jsonLd: event
      ? {
          "@context": "https://schema.org",
          "@type": "Event",
          name: `${event.name} — ${SITE_NAME}`,
          description: event.description,
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
          url: `${SITE_URL}/events/${event.slug}`,
          ...(event.registration_open
            ? { offers: { "@type": "Offer", url: `${SITE_URL}/register`, availability: "https://schema.org/InStock" } }
            : {}),
        }
      : null,
  });

  return (
    <PublicLayout>
      <PageBackdrop bgPosition="15% 1%">
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 4xl:max-w-5xl 6xl:max-w-6xl 7xl:max-w-[90rem]">
          {!event && <EventNotFound />}

          {event && (
            <Reveal as="div" className="glass-card rounded-[35px] p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.25)] sm:p-12">
              <h1 className="font-script text-glow-white text-center text-6xl text-white sm:text-8xl">
                {event.name}
              </h1>

              <EventDescription description={event.description} />
              <EventInfoList title="GUIDELINES" items={event.guidelines} />
              <EventInfoList title="RULES" items={event.rules} />
              <EventMetaFooter event={event} />
            </Reveal>
          )}
        </div>
      </PageBackdrop>
    </PublicLayout>
  );
}
