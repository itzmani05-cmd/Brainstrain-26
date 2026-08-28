import bgGridSun from "../assets/bg-grid-sun.webp";
import bgGridSunNew from "../assets/bg-grid-sun-new.jpg";

export default function PageBackdrop({
  children,
  className = "",
  bgPosition = "1% 1%",
  backgroundImage = bgGridSun,
}) {
  return (
    <div
      className={`page-backdrop relative min-h-screen bg-bs-ink bg-cover bg-fixed bg-no-repeat ${className}`}
      style={{
        "--page-bg-desktop": `url(${backgroundImage === bgGridSun ? bgGridSunNew : backgroundImage})`,
        "--page-bg-mobile": `url(${backgroundImage})`,
        backgroundPosition: bgPosition,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bs-ink/70 to-bs-black" />
      <div className="relative">{children}</div>
    </div>
  );
}