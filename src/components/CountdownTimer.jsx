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
    { label: "Days", value: remaining.days },
    { label: "Hrs", value: remaining.hours },
    { label: "Mins", value: remaining.minutes },
    { label: "Secs", value: remaining.seconds },
  ];

  return (
    <div className="flex items-end justify-center gap-3 sm:gap-4">
      {units.map((u) => (
        <div key={u.label} className="flex w-[70px] flex-col items-center sm:w-[85px]">
          <span
            key={u.value}
            className="animate-tick font-display text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] sm:text-5xl"
          >
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="-mt-1 w-full rounded-xl bg-bs-plum/90 py-2 text-center font-display text-sm font-bold tracking-wide text-bs-white shadow-[0_4px_10px_rgba(0,0,0,0.4)] sm:py-2.5 sm:text-lg">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
