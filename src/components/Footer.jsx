import { useState } from "react";
import bgFooter from "../assets/ContactRightSide.png";
import faqs from "../data/faqs";

const contacts = [
  { name: "SARAVANAVEL C", phone: "9171098222" },
  { name: "JANANI S", phone: "6381067709" },
];

function FaqItem({ faq, open, onToggle }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition duration-300 hover:border-bs-pink/40 hover:bg-white/[0.06]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-body text-sm font-semibold tracking-wide text-white sm:text-base 4xl:px-8 4xl:py-6 4xl:text-xl"
      >
        {faq.q}
        <span
          className={`shrink-0 text-lg text-bs-pink transition-transform duration-300 ${open ? "rotate-45" : ""}`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      {open && (
        <p className="px-5 pb-4 font-body text-xs leading-relaxed text-bs-white/70 sm:text-sm 4xl:px-8 4xl:pb-6 4xl:text-lg">
          {faq.a}
        </p>
      )}
    </div>
  );
}

export default function Footer() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <footer className="relative overflow-hidden bg-bs-black py-16 sm:py-20 4xl:py-28 6xl:py-36 7xl:py-44">
      <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-bs-pink/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-0 h-80 w-80 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10 4xl:max-w-[100rem] 6xl:max-w-[130rem]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-script text-glow-white rotate-3 text-5xl text-white sm:text-6xl 4xl:text-8xl">
            FAQ
          </h2>
          <div className="mt-7 space-y-3 text-left 4xl:mt-10 4xl:space-y-4">
            {faqs.map((faq, i) => (
              <FaqItem
                key={faq.q}
                faq={faq}
                open={openIndex === i}
                onToggle={() => setOpenIndex((cur) => (cur === i ? null : i))}
              />
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-10 md:flex-row md:items-center md:justify-between 4xl:mt-20">
          <div className="relative w-full max-w-md md:w-[45%]">
            <div className="absolute inset-0 rounded-full bg-bs-pink/10 blur-[80px]" />

            <img
              src={bgFooter}
              alt=""
              aria-hidden="true"
              className="relative mx-auto w-full max-w-sm object-contain mix-blend-lighten 4xl:max-w-lg 6xl:max-w-xl"
            />
          </div>

          <div
            id="contact"
            className="relative w-full max-w-lg scroll-mt-28 text-center md:w-[50%] md:text-left 4xl:max-w-2xl 6xl:max-w-3xl"
          >
            <h2 className="font-script text-glow-white -rotate-3 text-5xl text-white sm:text-6xl 4xl:text-8xl 6xl:text-9xl">
              Contact
            </h2>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:gap-5 4xl:mt-10 4xl:gap-8">
              {contacts.map((contact) => (
                <div
                  key={contact.name}
                  className="group flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-sm transition duration-300 hover:border-bs-pink/40 hover:bg-white/[0.06] 4xl:px-8 4xl:py-6"
                >
                  <p className="font-body text-sm font-semibold tracking-wide text-white sm:text-base 4xl:text-xl 6xl:text-2xl">
                    {contact.name}
                  </p>

                  <a
                    href={`tel:+91${contact.phone}`}
                    className="mt-1 block font-body text-xs text-bs-white/60 transition hover:text-bs-pink sm:text-sm 4xl:text-lg 6xl:text-xl"
                  >
                    +91 {contact.phone}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center gap-3 md:justify-start 4xl:mt-10 4xl:gap-5">
              <a
                href="https://www.instagram.com/literary_and_debating_society?igsi=MXEzcjIwNHl4azQ1MA=="
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="neon-border-pink flex h-10 w-10 items-center justify-center rounded-lg text-white transition duration-300 hover:-translate-y-1 hover:scale-110 4xl:h-16 4xl:w-16 6xl:h-20 6xl:w-20"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px] 4xl:h-7 4xl:w-7 6xl:h-9 6xl:w-9"
                  fill="currentColor"
                >
                  <path d="M12 2.2c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.94 3.9 2.4 7.15 2.27 8.42 2.21 8.8 2.2 12 2.2Zm0 3.9a5.9 5.9 0 1 0 0 11.8 5.9 5.9 0 0 0 0-11.8Zm0 9.73a3.83 3.83 0 1 1 0-7.66 3.83 3.83 0 0 1 0 7.66Zm6.13-9.96a1.38 1.38 0 1 1-2.76 0 1.38 1.38 0 0 1 2.76 0Z" />
                </svg>
              </a>

              <a
                href="mailto:litsociety.gct@gmail.com"
                aria-label="Email"
                className="neon-border-blue flex h-10 w-10 items-center justify-center rounded-lg text-white transition duration-300 hover:-translate-y-1 hover:scale-110 4xl:h-16 4xl:w-16 6xl:h-20 6xl:w-20"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px] 4xl:h-7 4xl:w-7 6xl:h-9 6xl:w-9"
                  fill="currentColor"
                >
                  <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13Zm2.2.3 7.3 6.03a.8.8 0 0 0 1 0l7.3-6.02a.6.6 0 0 0-.3-.31H4.5a.6.6 0 0 0-.3.3Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-5 text-center 4xl:mt-16 4xl:pt-8">
          <p className="font-body text-[10px] uppercase tracking-[0.25em] text-bs-white/40 sm:text-xs 4xl:text-base 6xl:text-lg">
            Powered by the Literary and Debating Society
          </p>
        </div>
      </div>
    </footer>
  );
}
