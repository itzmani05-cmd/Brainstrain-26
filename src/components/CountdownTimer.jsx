import { useEffect, useState } from "react";

function getRemaining(target) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

export default function CountdownTimer({ target }) {
  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { label: "DAYS", value: remaining.days },
    { label: "HRS", value: remaining.hours },
    { label: "MINS", value: remaining.minutes },
    { label: "SEC", value: remaining.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-[clamp(8px,3vw,16px)] sm:gap-4 lg:gap-6 2xl:gap-8 4xl:gap-12 6xl:gap-16">
      {units.map((u) => (
        <div
          key={u.label}
          className="flex w-[clamp(58px,17vw,73px)] flex-col items-center justify-center overflow-hidden rounded-xl bg-black/50 py-[clamp(8px,3vw,12px)] transition-transform duration-300 hover:scale-105 sm:w-[73px] sm:py-2 lg:w-[120px] lg:py-3 2xl:w-[150px] 2xl:rounded-2xl 2xl:py-5 4xl:w-[240px] 4xl:py-7 6xl:w-[320px] 6xl:py-10"
        >
          <span
            key={u.value}
            className="text-glow-pink animate-tick font-body text-[clamp(1.25rem,6vw,1.875rem)] tracking-[0.1em] text-white sm:text-3xl lg:text-4xl 2xl:text-5xl 4xl:text-6xl 6xl:text-7xl"
          >
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="mt-0.5 font-body text-[clamp(9px,2.2vw,12px)] tracking-[0.15em] text-white sm:text-sm lg:text-base 2xl:text-lg 4xl:text-xl 6xl:text-2xl">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
