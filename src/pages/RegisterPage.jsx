import PublicLayout from "../components/PublicLayout";
import PageBackdrop from "../components/PageBackdrop";
import ScriptHeading from "../components/ScriptHeading";
import Reveal from "../components/Reveal";
import RegistrationEmbed from "../components/register/RegistrationEmbed";

export default function RegisterPage() {
  return (
    <PublicLayout>
      <PageBackdrop>
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-16">
          <ScriptHeading as="h1" className="mb-10 text-center">
            Registration
          </ScriptHeading>

          <Reveal>
            <RegistrationEmbed />
          </Reveal>
        </div>
      </PageBackdrop>
    </PublicLayout>
  );
}
