import PublicLayout from "../components/PublicLayout";
import PageBackdrop from "../components/PageBackdrop";
import EventList from "../components/events/EventList";
import events from "../data/events";

export default function EventsPage() {
  return (
    <PublicLayout>
      <PageBackdrop bgPosition="15% 1%">
        <div className="mx-auto max-w-4xl px-4 pb-24 pt-32">
          <EventList events={events} />
        </div>
      </PageBackdrop>
    </PublicLayout>
  );
}
