import { Link } from "react-router-dom";

const glow = {
  pink: "shadow-[0_0_6.9px_1px_#d13aaa] text-shadow-[0_0_4px_#d13aaa]",
  blue: "shadow-[0_0_6.9px_1px_#009ac9] text-shadow-[0_0_4px_#009ac9]",
};

export default function NeonButton({
  to,
  href,
  onClick,
  type = "button",
  color = "pink",
  className = "",
  disabled = false,
  children,
}) {
  const classes = `btn-shimmer inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 font-body text-sm tracking-[0.15em] text-white transition-all duration-200 hover:scale-[1.03] hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:text-base ${glow[color]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
