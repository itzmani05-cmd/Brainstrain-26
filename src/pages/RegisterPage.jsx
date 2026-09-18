import PublicLayout from "../components/PublicLayout";
import PageBackdrop from "../components/PageBackdrop";
import ScriptHeading from "../components/ScriptHeading";
import Reveal from "../components/Reveal";
import RegistrationForm from "../components/register/RegistrationForm";
import useSeo, { SITE_NAME } from "../hooks/useSeo";
import useRegistrationStatus from "../hooks/useRegistrationStatus";

function OnSpotNotice() {
  return (
    <div className="glass-card rounded-[35px] p-8 text-center shadow-[4px_4px_10px_rgba(0,0,0,0.25)] sm:p-14">
      <h2 className="font-script text-glow-white text-5xl text-white sm:text-6xl">
        Register On Spot
      </h2>
      <p className="mx-auto mt-4 max-w-md font-body text-bs-white/80">
        Online registration has closed. You can still register at the venue on the day of
        the event — walk in, pay, and get your BS ID on the spot.
      </p>
      <div className="mx-auto mt-8 max-w-sm border-t border-white/10 pt-6">
        <h3 className="text-glow-pink font-body text-xs tracking-[0.2em] text-bs-pink">
          QUERIES?
        </h3>
        <div className="mt-3 flex flex-col gap-1 font-body text-sm text-bs-white/80">
          <p>
            Maharaja ·{" "}
            <a href="tel:+918939811573" className="hover:text-bs-pink">
              89398 11573
            </a>
          </p>
          <p>
            Muthu Pavithra ·{" "}
            <a href="tel:+919043205113" className="hover:text-bs-pink">
              90432 05113
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  useSeo({
    title: `Register | ${SITE_NAME}`,
    description:
      "Register for Brainstrain '26 events — GCT Coimbatore's inter-collegiate literary fest on September 19, 2026.",
    path: "/register",
  });

  const registrationOpen = useRegistrationStatus();

  return (
    <PublicLayout>
      <PageBackdrop>
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-40 4xl:max-w-5xl 6xl:max-w-6xl 7xl:max-w-[90rem]">
          <ScriptHeading as="h1" className="mb-10 text-center">
            Registration
          </ScriptHeading>

          <Reveal>{registrationOpen ? <RegistrationForm /> : <OnSpotNotice />}</Reveal>
        </div>
      </PageBackdrop>
    </PublicLayout>
  );
}
