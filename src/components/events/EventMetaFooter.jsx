export default function EventMetaFooter({ event }) {
  return (
    <>
      <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
        <div className="text-center sm:text-left">
          <h3 className="font-body text-sm tracking-[0.2em] text-bs-pink">CONTACT</h3>
          <p className="font-body text-bs-white/90">
            {event.contact_name} {event.contact_phone && `· ${event.contact_phone}`}
          </p>
        </div>
        {event.prize_pool && (
          <div className="text-center sm:text-right">
            <h3 className="text-glow-blue font-body text-sm tracking-[0.2em] text-bs-blue">
              PRIZE POOL
            </h3>
            <p className="text-glow-blue font-body text-3xl text-white">{event.prize_pool}</p>
          </div>
        )}
      </div>

      {!event.registration_open && (
        <p className="mt-6 text-center font-body text-sm tracking-widest text-red-300">
          REGISTRATION CLOSED
        </p>
      )}
    </>
  );
}
