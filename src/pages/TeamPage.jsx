import PublicLayout from "../components/PublicLayout";
import PageBackdrop from "../components/PageBackdrop";
import ScriptHeading from "../components/ScriptHeading";
import TeamRow from "../components/TeamRow";
import Reveal from "../components/Reveal";
import { teamSections } from "../data/teamData";

export default function TeamPage() {
  return (
    <PublicLayout>
      <PageBackdrop>
        <div className="mx-auto max-w-5xl px-4 pb-24 pt-16">
          <ScriptHeading as="h1" className="mb-16 text-left">
            Our Team
          </ScriptHeading>

          {teamSections.map((section, i) => (
            <Reveal key={section.title} delay={i * 100}>
              <TeamRow title={section.title} members={section.members} />
            </Reveal>
          ))}
        </div>
      </PageBackdrop>
    </PublicLayout>
  );
}
