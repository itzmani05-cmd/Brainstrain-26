import PublicLayout from "../components/PublicLayout";
import PageBackdrop from "../components/PageBackdrop";
import ScriptHeading from "../components/ScriptHeading";
import Reveal from "../components/Reveal";
import RegistrationForm from "../components/register/RegistrationForm";

export default function RegisterPage() {
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
