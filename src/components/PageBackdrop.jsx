import bgGridSun from "../assets/bg-grid-sun.webp";

export default function PageBackdrop({ children, className = "" }) {
  return (
    <div
      className={`animate-bg-pan relative min-h-screen bg-bs-ink bg-cover bg-no-repeat ${className}`}
      style={{ backgroundImage: `url(${bgGridSun})`, backgroundSize: "130% auto" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-bs-black/40 via-bs-ink/70 to-bs-black" />
      <div className="relative">{children}</div>
    </div>
  );
}
