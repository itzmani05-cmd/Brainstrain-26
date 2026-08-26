export default function EventDescription({ description }) {
  return (
    <section className="mt-10 4xl:mt-16">
      <h2 className="text-glow-pink font-body text-lg tracking-[0.2em] text-bs-pink 4xl:text-2xl 6xl:text-3xl">
        DESCRIPTION
      </h2>
      <p className="mt-3 whitespace-pre-line font-body leading-relaxed text-bs-white/90 4xl:mt-5 4xl:text-xl 6xl:text-2xl">
        {description}
      </p>
    </section>
  );
}
