import { useEffect, useState } from "react";
import { apiUrl } from "../lib/api";

// Whether online registration is open. Defaults to true (open) until the
// fetch resolves, so the UI doesn't flash a "closed" state on load.
export default function useRegistrationStatus() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(apiUrl("/api/registration-status"))
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (!cancelled && body) setOpen(body.open);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return open;
}
