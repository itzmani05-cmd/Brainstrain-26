import bgFooter from "../assets/ContactRightSide.png";
import trianglesFrame from "../assets/contact/Triangles.png";

const contacts = [
  { name: "SARAVANAVEL C", phone: "9171098222" },
  { name: "JANANI S", phone: "6381067709" },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-bs-black pb-20 pt-32 sm:pt-36">
      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <div className="w-full max-w-sm sm:max-w-md md:ml-auto md:mr-[4%] md:max-w-lg">
          <h2 className="font-script text-glow-white -rotate-6 text-5xl text-white sm:text-6xl">
            Contact
          </h2>

          <div className="relative mx-auto mt-6 aspect-[677/882] w-full sm:mt-3">
            <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
              <img
                src={trianglesFrame}
                alt=""
                aria-hidden
                className="h-full w-full select-none object-contain opacity-95"
              />
            </div>

            <div className="absolute left-[44%] top-[46%] z-[5] w-[58%] -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="flex flex-col items-center gap-3">
                {contacts.map((c) => (
                  <div key={c.name} className="flex flex-col items-center gap-0.5">
                    <p className="font-body text-sm font-semibold text-white sm:text-lg md:text-xl">
                      {c.name}
                    </p>
                    <a
                      href={`tel:+91${c.phone}`}
                      className="font-body text-xs text-bs-white/80 transition hover:text-bs-pink sm:text-sm md:text-base"
                    >
                      {c.phone}
                    </a>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-center gap-3 sm:mt-5">
                <a
                  href="https://www.instagram.com/literary_and_debating_society?igsi=MXEzcjIwNHl4azQ1MA=="
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="neon-border-pink flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white transition hover:scale-110 sm:h-9 sm:w-9"
                >
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
                    <path d="M12 2.2c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.94 3.9 2.4 7.15 2.27 8.42 2.21 8.8 2.2 12 2.2Zm0 3.9a5.9 5.9 0 1 0 0 11.8 5.9 5.9 0 0 0 0-11.8Zm0 9.73a3.83 3.83 0 1 1 0-7.66 3.83 3.83 0 0 1 0 7.66Zm6.13-9.96a1.38 1.38 0 1 1-2.76 0 1.38 1.38 0 0 1 2.76 0Z" />
                  </svg>
                </a>
                <a
                  href="mailto:litsociety.gct@gmail.com"
                  aria-label="Email"
                  className="neon-border-blue flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white transition hover:scale-110 sm:h-9 sm:w-9"
                >
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
                    <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13Zm2.2.3 7.3 6.03a.8.8 0 0 0 1 0l7.3-6.02a.6.6 0 0 0-.3-.31H4.5a.6.6 0 0 0-.3.3Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <img
          src={bgFooter}
          alt=""
          aria-hidden
          className="pointer-events-none relative mx-auto mt-10 block w-[85%] max-w-sm mix-blend-lighten sm:w-[70%] sm:max-w-md md:absolute md:inset-y-0 md:left-0 md:top-1/2 md:mx-0 md:mt-0 md:w-[42%] md:max-w-xl md:-translate-y-1/2"
        />

        <p className="relative mt-10 font-body text-sm tracking-[0.3em] text-bs-white/70">
          POWERED BY THE LITERARY AND DEBATING SOCIETY
        </p>
      </div>
    </footer>
  );
}
