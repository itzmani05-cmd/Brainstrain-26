import PublicLayout from "../components/PublicLayout";
import PageBackdrop from "../components/PageBackdrop";
import ScriptHeading from "../components/ScriptHeading";
import Reveal from "../components/Reveal";
import RegistrationForm from "../components/register/RegistrationForm";
import useSeo, { SITE_NAME } from "../hooks/useSeo";

export default function RegisterPage() {
  useSeo({
    title: `Register | ${SITE_NAME}`,
    description:
      "Register for Brainstrain '26 events — GCT Coimbatore's inter-collegiate literary fest on September 19, 2026.",
    path: "/register",
  });

  return (
    <PublicLayout>
      <PageBackdrop>
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-40 4xl:max-w-5xl 6xl:max-w-6xl 7xl:max-w-[90rem]">
          <ScriptHeading as="h1" className="mb-10 text-center">
            Registration
          </ScriptHeading>

          <Reveal>
            <RegistrationForm />
          </Reveal>
        </div>
      </PageBackdrop>
    </PublicLayout>
  );
}
