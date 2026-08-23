export default function EventInfoList({ title, items, color = "pink" }) {
  if (!items?.length) return null;

  const titleClass = color === "pink" ? "text-glow-pink text-bs-pink" : "text-glow-blue text-bs-blue";

  return (
    <section className="mt-10">
      <h2 className={`font-body text-lg tracking-[0.2em] ${titleClass}`}>{title}</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 font-body leading-relaxed text-bs-white/90">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
    </section>
  );
}
