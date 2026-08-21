import { Link } from "react-router-dom";
import { resolveEventImage } from "../data/eventImages";
import { PhoneIcon } from "./icons";

export default function EventCard({ event }) {
  const img = resolveEventImage(event.image_url);

  return (
    <div className="glass-card group flex flex-col gap-4 rounded-3xl p-5 transition duration-300 hover:border-bs-pink/40 hover:shadow-[0_0_24px_rgba(209,58,170,0.25)] sm:flex-row sm:items-center sm:p-6">
      <div className="mx-auto h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-white shadow-[0_0_15.7px_4px_#491c55] transition duration-300 group-hover:scale-105 sm:mx-0">
        {img ? (
          <img src={img} alt={event.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black text-2xl">🎭</div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 text-center sm:text-left">
        <h3 className="font-body text-2xl font-semibold uppercase tracking-wide text-white">
          {event.name}
        </h3>
        {event.description && (
          <p className="font-body text-sm text-bs-white/80 line-clamp-3">{event.description}</p>
        )}

        <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:items-center">
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

        {event.contact_name && (
          <p className="mt-2 flex items-center justify-center gap-2 font-body text-sm text-bs-white/80 sm:justify-start">
            <PhoneIcon className="h-4 w-4 fill-current text-bs-white/60" />
            {event.contact_name} {event.contact_phone}
          </p>
        )}
      </div>
    </div>
  );
}
