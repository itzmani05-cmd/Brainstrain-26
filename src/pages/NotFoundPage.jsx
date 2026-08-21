import PublicLayout from "../components/PublicLayout";
import PageBackdrop from "../components/PageBackdrop";
import ScriptHeading from "../components/ScriptHeading";
import NeonButton from "../components/NeonButton";

export default function NotFoundPage() {
  return (
    <PublicLayout>
      <PageBackdrop>
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
          <ScriptHeading as="h1" className="text-6xl sm:text-8xl">
            404
          </ScriptHeading>
          <p className="mt-4 font-body text-bs-white/70">This page drifted off the grid.</p>
          <div className="mt-8">
            <NeonButton to="/" color="pink">
              Back Home
            </NeonButton>
          </div>
        </div>
      </PageBackdrop>
    </PublicLayout>
  );
}
