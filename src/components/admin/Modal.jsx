export default function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        style={{ animation: "overlay-in 200ms ease-out both" }}
        onClick={onClose}
      />
      <div
        className={`glass-card relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl border border-white/15 p-6 sm:p-8`}
        style={{ animation: "modal-in 220ms cubic-bezier(0.16, 1, 0.3, 1) both" }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-body text-xl font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full border border-white/20 px-2.5 py-1 text-white/70 transition hover:border-bs-pink hover:text-white"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
