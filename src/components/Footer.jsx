import bgFooter from "../assets/bg-footer.webp";
import triangles from "../assets/triangles.svg";
import Reveal from "./Reveal";
import { PhoneIcon } from "./icons";

const contacts = [
  { name: "SARAVANAVEL C", phone: "9171098222" },
  { name: "JANANI S", phone: "6381067709" },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-bs-black bg-cover bg-center py-20"
      style={{ backgroundImage: `url(${bgFooter})` }}
    >
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-bs-black/40 via-transparent to-bs-black" />

      <Reveal as="div" className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4">
        <div className="relative flex w-full max-w-xl flex-col items-center">
          <img
            src={triangles}
            alt=""
            aria-hidden
            className="animate-float pointer-events-none absolute -top-16 right-[-40px] h-[160px] w-[190px] opacity-25 sm:-top-20 sm:right-[-60px] sm:h-[200px] sm:w-[230px]"
          />

          <div className="glass-card relative w-full rounded-[32px] px-6 py-10 text-center sm:px-12 sm:py-12">
            <h2 className="font-script text-glow-white -rotate-6 text-6xl text-white sm:text-7xl">
              Contact
            </h2>

            <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-14">
              {contacts.map((c) => (
                <a
                  key={c.name}
                  href={`tel:+91${c.phone}`}
                  className="group flex flex-col items-center gap-1 transition hover:-translate-y-0.5"
                >
                  <p className="font-body text-xl font-semibold tracking-wide text-white sm:text-2xl">
                    {c.name}
                  </p>
                  <span className="flex items-center gap-2 font-body text-base text-bs-white/80 transition group-hover:text-bs-pink sm:text-lg">
                    <PhoneIcon className="h-4 w-4 fill-current" />
                    {c.phone}
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-bs-white transition hover:scale-110 hover:text-bs-pink"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                  <path d="M12 2.2c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.94 3.9 2.4 7.15 2.27 8.42 2.21 8.8 2.2 12 2.2Zm0 3.9a5.9 5.9 0 1 0 0 11.8 5.9 5.9 0 0 0 0-11.8Zm0 9.73a3.83 3.83 0 1 1 0-7.66 3.83 3.83 0 0 1 0 7.66Zm6.13-9.96a1.38 1.38 0 1 1-2.76 0 1.38 1.38 0 0 1 2.76 0Z" />
                </svg>
              </a>
              <a
                href="mailto:brainstrain26@gmail.com"
                aria-label="Email"
                className="text-bs-white transition hover:scale-110 hover:text-bs-pink"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                  <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13Zm2.2.3 7.3 6.03a.8.8 0 0 0 1 0l7.3-6.02a.6.6 0 0 0-.3-.31H4.5a.6.6 0 0 0-.3.3Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <p className="text-center font-body text-sm tracking-[0.3em] text-bs-white/70">
          POWERED BY THE LITERARY AND DEBATING SOCIETY
        </p>
      </Reveal>
    </footer>
  );
}
