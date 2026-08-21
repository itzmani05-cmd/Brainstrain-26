const styles = {
  green: "border-green-400/40 bg-green-500/10 text-green-300",
  red: "border-red-400/40 bg-red-500/10 text-red-300",
  yellow: "border-yellow-400/40 bg-yellow-500/10 text-yellow-300",
  pink: "border-bs-pink/40 bg-bs-pink/10 text-pink-300",
  gray: "border-white/20 bg-white/5 text-white/60",
};

export default function Badge({ color = "gray", children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-body text-xs tracking-wide ${styles[color] ?? styles.gray}`}
    >
      {children}
    </span>
  );
}
