export default function EventDescription({ description }) {
  return (
    <section className="mt-10">
      <h2 className="text-glow-pink font-body text-lg tracking-[0.2em] text-bs-pink">
        DESCRIPTION
      </h2>
      <p className="mt-3 whitespace-pre-line font-body leading-relaxed text-bs-white/90">{description}</p>
    </section>
  );
}
