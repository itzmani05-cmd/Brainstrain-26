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

      {!event.registration_open && (
        <p className="mt-6 text-center font-body text-sm tracking-widest text-red-300 4xl:mt-9 4xl:text-lg">
          REGISTRATION CLOSED
        </p>
      )}
    </>
  );
}
