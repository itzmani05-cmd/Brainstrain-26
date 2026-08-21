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
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      {units.map((u) => (
        <div
          key={u.label}
          className="flex w-[70px] flex-col items-center justify-center overflow-hidden rounded-xl bg-black/50 py-3 transition-transform duration-300 hover:scale-105 sm:w-[123px] sm:py-4"
        >
          <span
            key={u.value}
            className="text-glow-pink animate-tick font-body text-2xl tracking-[0.2em] text-white sm:text-4xl"
          >
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="mt-1 font-body text-[10px] tracking-[0.3em] text-white sm:text-sm">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
