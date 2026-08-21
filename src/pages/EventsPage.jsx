import { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import PageBackdrop from "../components/PageBackdrop";
import ScriptHeading from "../components/ScriptHeading";
import EventCard from "../components/EventCard";
import Reveal from "../components/Reveal";
import { supabase } from "../lib/supabaseClient";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    supabase
      .from("events")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setError(error.message);
        else setEvents(data ?? []);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Network error");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <PublicLayout>
      <PageBackdrop>
        <div className="mx-auto max-w-4xl px-4 pb-24 pt-16">
          <ScriptHeading as="h1" className="mb-14 text-center">
            Events
          </ScriptHeading>

          {loading && (
            <p className="text-center font-body text-bs-white/70">Loading events…</p>
          )}
          {error && (
            <p className="text-center font-body text-red-300">Couldn&apos;t load events: {error}</p>
          )}
          {!loading && !error && events.length === 0 && (
            <p className="text-center font-body text-bs-white/70">
              Events will be announced here soon.
            </p>
          )}

          <div className="flex flex-col gap-8">
            {events.map((ev, i) => (
              <Reveal key={ev.id} delay={Math.min(i, 5) * 80}>
                <EventCard event={ev} />
              </Reveal>
            ))}
          </div>
        </div>
      </PageBackdrop>
    </PublicLayout>
  );
}
