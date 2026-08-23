import { Link } from "react-router-dom";

export default function EventNotFound() {
  return (
    <div className="text-center">
      <p className="font-body text-bs-white/80">This event couldn&apos;t be found.</p>
      <Link to="/events" className="mt-4 inline-block font-body text-bs-pink underline">
        Back to Events
      </Link>
    </div>
  );
}
