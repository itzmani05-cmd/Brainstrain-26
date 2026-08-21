import Reveal from "./Reveal";
import telephone from "../assets/figma/telephone.svg";
import wand from "../assets/figma/wand.svg";
import cable from "../assets/figma/footer-cable.svg";
import iconInsta from "../assets/figma/icon-insta.svg";
import iconEmail from "../assets/figma/icon-email.svg";

const contacts = [
  { name: "Bharani", phone: "75400 09703" },
  { name: "Akash", phone: "6385 698 553" },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-stars relative overflow-hidden bg-bs-black py-20">
      <img
        src={cable}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-24 left-0 hidden w-full opacity-70 md:block"
      />

      <Reveal
        as="div"
        className="relative mx-auto flex max-w-6xl flex-col items-center gap-14 px-4 md:flex-row md:items-center md:justify-between"
      >
        <div className="relative shrink-0">
          <img src={telephone} alt="" aria-hidden className="w-56 sm:w-72 md:w-80" />
          <img
            src={wand}
            alt=""
            aria-hidden
            className="pointer-events-none absolute -right-6 top-1/3 hidden w-8 opacity-90 md:block"
          />
        </div>

        <div className="flex flex-col items-center gap-8 text-center md:items-end md:text-right">
          <h2 className="font-display text-emboss -rotate-2 text-5xl font-bold text-bs-white sm:text-6xl">
            Contact
          </h2>

          <div className="flex flex-col gap-2">
            {contacts.map((c) => (
              <a
                key={c.name}
                href={`tel:+91${c.phone.replace(/\s+/g, "")}`}
                className="font-display text-lg font-bold text-bs-white transition hover:text-bs-pink sm:text-xl"
              >
                {c.name} &nbsp;-&nbsp; {c.phone}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="transition hover:scale-110"
            >
              <img src={iconInsta} alt="" className="h-11 w-11 sm:h-12 sm:w-12" />
            </a>
            <a href="mailto:brainstrain26@gmail.com" aria-label="Email" className="transition hover:scale-110">
              <img src={iconEmail} alt="" className="h-11 w-11 sm:h-12 sm:w-12" />
            </a>
          </div>
        </div>
      </Reveal>

      <p className="relative mt-16 text-center font-display text-sm tracking-[0.2em] text-bs-white/80 sm:text-base">
        Powered By The Literary And Debating Society
      </p>
    </footer>
  );
}
