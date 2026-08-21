import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import PageBackdrop from "../components/PageBackdrop";
import NeonButton from "../components/NeonButton";
import Reveal from "../components/Reveal";
import { supabase } from "../lib/supabaseClient";

export default function EventDetailPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error || !data) setNotFound(true);
        else setEvent(data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setNotFound(true);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <PublicLayout>
      <PageBackdrop>
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-16">
          {loading && <p className="text-center font-body text-bs-white/70">Loading…</p>}

          {notFound && !loading && (
            <div className="text-center">
              <p className="font-body text-bs-white/80">This event couldn&apos;t be found.</p>
              <Link to="/events" className="mt-4 inline-block font-body text-bs-pink underline">
                Back to Events
              </Link>
            </div>
          )}

          {event && (
            <Reveal as="div" className="glass-card rounded-[32px] p-6 sm:p-12">
              <h1 className="font-script text-glow-white text-center text-6xl text-white sm:text-8xl">
                {event.name}
              </h1>

              <section className="mt-10">
                <h2 className="text-glow-pink font-body text-lg tracking-[0.2em] text-bs-pink">
                  DESCRIPTION
                </h2>
                <p className="mt-3 font-body leading-relaxed text-bs-white/90">
                  {event.description}
                </p>
              </section>

              {event.guidelines?.length > 0 && (
                <section className="mt-10">
                  <h2 className="text-glow-pink font-body text-lg tracking-[0.2em] text-bs-pink">
                    GUIDELINES
                  </h2>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 font-body leading-relaxed text-bs-white/90">
                    {event.guidelines.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ol>
                </section>
              )}

              {event.rules?.length > 0 && (
                <section className="mt-10">
                  <h2 className="text-glow-pink font-body text-lg tracking-[0.2em] text-bs-pink">
                    RULES
                  </h2>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 font-body leading-relaxed text-bs-white/90">
                    {event.rules.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ol>
                </section>
              )}

              <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
                <div className="text-center sm:text-left">
                  <h3 className="font-body text-sm tracking-[0.2em] text-bs-pink">CONTACT</h3>
                  <p className="font-body text-bs-white/90">
                    {event.contact_name} {event.contact_phone && `· ${event.contact_phone}`}
                  </p>
                </div>
                {event.prize_pool && (
                  <div className="text-center sm:text-right">
                    <h3 className="font-body text-sm tracking-[0.2em] text-bs-pink">PRIZE POOL</h3>
                    <p className="font-body text-3xl text-white">{event.prize_pool}</p>
                  </div>
                )}
              </div>

              <div className="mt-10 flex flex-col items-center gap-3">
                {event.registration_open ? (
                  <NeonButton to={`/register?event=${event.slug}`} color="pink">
                    REGISTER FOR THIS EVENT
                  </NeonButton>
                ) : (
                  <p className="font-body text-sm tracking-widest text-red-300">
                    REGISTRATION CLOSED
                  </p>
                )}
                {event.is_team_event && (
                  <p className="font-body text-xs text-bs-white/60">
                    Team size: {event.min_team_size}–{event.max_team_size} members
                  </p>
                )}
              </div>
            </Reveal>
          )}
        </div>
      </PageBackdrop>
    </PublicLayout>
  );
}
