import { Link } from "react-router-dom";
import { resolveEventImage } from "../data/eventImages";
import { PhoneIcon } from "./icons";

export default function EventCard({ event }) {
  const img = resolveEventImage(event.image_url);

  return (
    <div className="glass-card group flex flex-col gap-4 rounded-[35px] p-5 shadow-[4px_4px_10px_rgba(0,0,0,0.25)] transition duration-300 sm:flex-row sm:items-center sm:p-6 4xl:gap-6 4xl:rounded-[48px] 4xl:p-9 6xl:p-12">
      <div className="flex flex-col gap-4 sm:flex-col  sm:gap-6 4xl:gap-9">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 4xl:gap-9">
          <div className="mx-auto h-32 w-32 shrink-0 overflow-hidden rounded-[30px] border-[3px] border-white shadow-[0_0_15.7px_8px_rgba(255,108,54,0.45)] transition duration-300 group-hover:scale-105 sm:mx-0 4xl:h-48 4xl:w-48 6xl:h-56 6xl:w-56">
            {img ? (
              <img src={img} alt={event.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-black text-2xl">🎭</div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2 text-center sm:text-left">
            <h3 className="text-glow-pink font-body text-2xl font-semibold uppercase tracking-[0.2em] text-white sm:text-3xl 4xl:text-4xl 6xl:text-5xl">
              {event.name}
            </h3>
            {event.description && (
              <p className="line-clamp-3 whitespace-pre-line font-body text-base text-bs-white/90 4xl:text-xl 6xl:text-2xl">
                {event.description}
              </p>
            )}

            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between 4xl:mt-4 4xl:gap-5">
              <Link
                to={`/events/${event.slug}`}
                className="neon-border-pink rounded-lg px-5 py-2 font-body text-sm tracking-wide text-white transition hover:scale-105 4xl:px-8 4xl:py-4 4xl:text-lg"
              >
                DISCOVER MORE
              </Link>
              {event.prize_pool && (
                <span className="neon-border-blue rounded-lg px-5 py-2 font-body text-sm tracking-[0.15em] text-white 4xl:px-8 4xl:py-4 4xl:text-lg">
                  Prize Pool: {event.prize_pool}
                </span>
              )}
              {!event.registration_open && (
                <span className="rounded-lg border border-red-400 px-4 py-2 font-body text-xs tracking-widest text-red-300 4xl:px-6 4xl:py-3 4xl:text-base">
                  REGISTRATION CLOSED
                </span>
              )}
            </div>
          </div>
        </div>
        {event.contacts?.length > 0 && (
          <div className="flex items-start gap-3 text-left">
            <PhoneIcon className="h-5 w-5 shrink-0 fill-current text-bs-white/80 4xl:h-7 4xl:w-7" />
            <p className="flex flex-col gap-1 font-body text-lg text-bs-white/90 sm:block sm:text-xl 4xl:text-2xl 6xl:text-3xl">
              {event.contacts.map((c, i) => (
                <span key={c.name}>
                  {i > 0 && <span className="hidden sm:inline">, </span>}
                  {c.name}
                  {c.phone && <span className="ml-2 text-base text-bs-white/70 sm:text-lg 4xl:text-xl 6xl:text-2xl">{c.phone}</span>}
                </span>
              ))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
