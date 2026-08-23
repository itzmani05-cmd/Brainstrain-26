// Paste the "Embed" src URL from your Google Form's Send > <> dialog here.
const GOOGLE_FORM_EMBED_URL = "";

export default function RegistrationEmbed() {
  if (GOOGLE_FORM_EMBED_URL) {
    return (
      <div className="overflow-hidden rounded-[20px] bg-[#ededed] shadow-[4px_4px_10px_rgba(0,0,0,0.25)]">
        <iframe
          title="Brainstrain '26 Registration"
          src={GOOGLE_FORM_EMBED_URL}
          className="h-[900px] w-full border-0"
        >
          Loading…
        </iframe>
      </div>
    );
  }

  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center rounded-[20px] bg-[#ededed] p-10 text-center shadow-[4px_4px_10px_rgba(0,0,0,0.25)]">
      <p className="font-body text-2xl font-semibold text-black/70">G form</p>
      <p className="mt-3 max-w-sm font-body text-sm text-black/50">
        The registration form will appear here once it&apos;s linked.
      </p>
    </div>
  );
}
