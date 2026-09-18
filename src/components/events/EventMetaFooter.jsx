import { useEffect, useState } from "react";
import { apiUrl } from "../../lib/api";

function EventResults({ slug }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(apiUrl(`/api/events/${slug}/result`))
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (!cancelled && body) setResult(body);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!result?.winner?.name) return null;

  const places = [
    { emoji: "🥇", label: "WINNER", entry: result.winner },
    { emoji: "🥈", label: "RUNNER-UP", entry: result.runnerUp },
    { emoji: "🥉", label: "THIRD PLACE", entry: result.thirdPlace },
  ].filter((p) => p.entry?.name);

  return (
    <div className="mt-12 border-t border-white/10 pt-8 4xl:mt-16 4xl:pt-12">
      <h3 className="text-center font-body text-sm tracking-[0.2em] text-bs-pink 4xl:text-lg 6xl:text-xl">
        RESULTS
      </h3>
      <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-10">
        {places.map((p) => (
          <div key={p.label} className="text-center">
            <p className="text-2xl 4xl:text-3xl">{p.emoji}</p>
            <p className="font-body text-xs tracking-[0.15em] text-bs-white/50 4xl:text-sm">
              {p.label}
            </p>
            <p className="font-body text-white 4xl:text-xl 6xl:text-2xl">{p.entry.name}</p>
            {p.entry.collegeName && (
              <p className="font-body text-xs text-bs-white/50">{p.entry.collegeName}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EventMetaFooter({ event }) {
  return (
    <>
      <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row 4xl:mt-16 4xl:gap-9 4xl:pt-12">
        <div className="text-center sm:text-left">
          <h3 className="font-body text-sm tracking-[0.2em] text-bs-pink 4xl:text-lg 6xl:text-xl">CONTACT</h3>
          {event.contacts?.map((c) => (
            <p key={c.name} className="font-body text-bs-white/90 4xl:text-xl 6xl:text-2xl">
              {c.name} {c.phone && `· ${c.phone}`}
            </p>
          ))}
        </div>
        {event.prize_pool && (
          <div className="text-center sm:text-right">
            <h3 className="text-glow-blue font-body text-sm tracking-[0.2em] text-bs-blue 4xl:text-lg 6xl:text-xl">
              PRIZE POOL
            </h3>
            <p className="text-glow-blue font-body text-3xl text-white 4xl:text-5xl 6xl:text-6xl">{event.prize_pool}</p>
          </div>
        )}
      </div>

      <EventResults slug={event.slug} />

      {!event.registration_open && (
        <p className="mt-6 text-center font-body text-sm tracking-widest text-red-300 4xl:mt-9 4xl:text-lg">
          REGISTRATION CLOSED
        </p>
      )}
    </>
  );
}
