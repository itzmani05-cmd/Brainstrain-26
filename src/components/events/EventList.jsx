import EventCard from "../EventCard";
import Reveal from "../Reveal";

export default function EventList({ events }) {
  if (events.length === 0) {
    return (
      <p className="text-center font-body text-bs-white/70">
        Events will be announced here soon.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {events.map((ev, i) => (
        <Reveal key={ev.slug} delay={Math.min(i, 5) * 80}>
          <EventCard event={ev} />
        </Reveal>
      ))}
    </div>
  );
}
