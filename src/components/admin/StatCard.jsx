export default function StatCard({ label, value, icon, accent = "pink", delay = 0 }) {
  const glow = {
    pink: "shadow-[0_0_18px_rgba(209,58,170,0.35)] border-bs-pink/40",
    blue: "shadow-[0_0_18px_rgba(0,154,201,0.35)] border-bs-blue/40",
    orange: "shadow-[0_0_18px_rgba(255,108,54,0.35)] border-bs-orange/40",
  };

  return (
    <div
      className={`animate-hero-in glass-card rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 ${glow[accent] ?? glow.pink}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-bs-white/60">{label}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="mt-3 font-body text-4xl font-bold text-white">{value}</p>
    </div>
  );
}
