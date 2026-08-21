export default function ScriptHeading({ as: Tag = "h2", className = "", children }) {
  return (
    <Tag
      className={`font-script text-glow-white text-4xl font-normal leading-none text-white sm:text-6xl md:text-7xl ${className}`}
    >
      {children}
    </Tag>
  );
}
