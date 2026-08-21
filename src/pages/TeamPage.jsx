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
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-16">
          <div className="glass-card rounded-[35px] p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.25)] sm:p-12">
            <ScriptHeading as="h1" className="mb-16 text-center">
              Our Team
            </ScriptHeading>

            {teamSections.map((section, i) => (
              <Reveal key={section.title} delay={i * 100}>
                <TeamRow title={section.title} members={section.members} />
              </Reveal>
            ))}
          </div>
        </div>
      </PageBackdrop>
    </PublicLayout>
  );
}
