export default function EventInfoList({ title, items, color = "pink" }) {
  if (!items?.length) return null;

  const titleClass = color === "pink" ? "text-glow-pink text-bs-pink" : "text-glow-blue text-bs-blue";

  return (
    <section className="mt-10 4xl:mt-16">
      <h2 className={`font-body text-lg tracking-[0.2em] 4xl:text-2xl 6xl:text-3xl ${titleClass}`}>{title}</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 font-body leading-relaxed text-bs-white/90 4xl:mt-5 4xl:space-y-3 4xl:pl-8 4xl:text-xl 6xl:text-2xl">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
