import PublicLayout from "../components/PublicLayout";
import EventList from "../components/events/EventList";
import events from "../data/events";
import bgEvent from "../assets/bgEvent.png";

export default function EventsPage() {
  return (
    <PublicLayout>
      <div
        className="relative min-h-screen bg-fixed bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgEvent})` }}
      >
        <div className="absolute inset-0 bg-bs-black/35" />
        <div className="relative mx-auto max-w-4xl px-4 pb-24 pt-32">
          <EventList events={events} />
        </div>
      </div>
    </PublicLayout>
  );
}
