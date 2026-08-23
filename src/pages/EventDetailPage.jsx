import { useParams } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import PageBackdrop from "../components/PageBackdrop";
import Reveal from "../components/Reveal";
import EventNotFound from "../components/events/EventNotFound";
import EventDescription from "../components/events/EventDescription";
import EventInfoList from "../components/events/EventInfoList";
import EventMetaFooter from "../components/events/EventMetaFooter";
import { getEventBySlug } from "../data/events";

export default function EventDetailPage() {
  const { slug } = useParams();
  const event = getEventBySlug(slug);

  return (
    <PublicLayout>
      <PageBackdrop bgPosition="15% 1%">
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-28">
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
