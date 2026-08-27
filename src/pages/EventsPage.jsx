import PublicLayout from "../components/PublicLayout";
import PageBackdrop from "../components/PageBackdrop";
import EventList from "../components/events/EventList";
import events from "../data/events";
import bgHero from "../assets/bg-hero.webp";

export default function EventsPage() {
  return (
    <PublicLayout>
      <PageBackdrop backgroundImage={bgHero} bgPosition="15% 1%">
        <div className="mx-auto max-w-4xl px-4 pb-24 pt-32 4xl:max-w-6xl 6xl:max-w-7xl 7xl:max-w-[100rem]">
          <EventList events={events} />
        </div>
      </PageBackdrop>
    </PublicLayout>
  );
}
