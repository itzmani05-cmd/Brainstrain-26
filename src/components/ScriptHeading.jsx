export default function ScriptHeading({ as: Tag = "h2", className = "", children }) {
  return (
    <Tag
      className={`font-script text-glow-white text-[clamp(2rem,9vw,3.4375rem)] font-normal leading-none text-white sm:text-6xl md:text-7xl 3xl:text-8xl 5xl:text-9xl 7xl:text-[12rem] ${className}`}
    >
      {children}
    </Tag>
  );
}
