import { Link } from "react-router-dom";
import { resolveEventImage } from "../data/eventImages";
import { PhoneIcon } from "./icons";

export default function EventCard({ event }) {
  const img = resolveEventImage(event.image_url);

  return (
    <div className="glass-card group flex flex-col gap-4 rounded-[35px] p-5 shadow-[4px_4px_10px_rgba(0,0,0,0.25)] transition duration-300 sm:flex-row sm:items-center sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-col  sm:gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="mx-auto h-32 w-32 shrink-0 overflow-hidden rounded-[30px] border-[3px] border-white shadow-[0_0_15.7px_8px_rgba(255,108,54,0.45)] transition duration-300 group-hover:scale-105 sm:mx-0">
            {img ? (
              <img src={img} alt={event.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-black text-2xl">🎭</div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2 text-center sm:text-left">
            <h3 className="text-glow-pink font-body text-2xl font-semibold uppercase tracking-[0.2em] text-white sm:text-3xl">
              {event.name}
            </h3>
            {event.description && (
              <p className="line-clamp-3 whitespace-pre-line font-body text-base text-bs-white/90">
                {event.description}
              </p>
            )}

            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to={`/events/${event.slug}`}
                className="neon-border-pink rounded-lg px-5 py-2 font-body text-sm tracking-wide text-white transition hover:scale-105"
              >
                DISCOVER MORE
              </Link>
              {event.prize_pool && (
                <span className="neon-border-blue rounded-lg px-5 py-2 font-body text-sm tracking-[0.15em] text-white">
                  Prize Pool: {event.prize_pool}
                </span>
              )}
              {!event.registration_open && (
                <span className="rounded-lg border border-red-400 px-4 py-2 font-body text-xs tracking-widest text-red-300">
                  REGISTRATION CLOSED
                </span>
              )}
            </div>
          </div>
        </div>
        {event.contacts?.length > 0 && (
          <div className="flex flex-col gap-2 text-left sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            {event.contacts.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 shrink-0 fill-current text-bs-white/80" />
                <p className="font-body text-lg text-bs-white/90 sm:text-xl">
                  {c.name}
                  {c.phone && <span className="ml-2 text-base text-bs-white/70 sm:text-lg">{c.phone}</span>}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
