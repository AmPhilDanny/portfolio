import { getExperiences } from "@/app/actions/experience";
import ExperienceForm from "./ExperienceForm";
import ExperienceItem from "./ExperienceItem";
import { Briefcase02Icon as Briefcase } from "hugeicons-react";

export default async function AdminExperiencePage() {
  const experiencesList = await getExperiences();

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
          <Briefcase className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-sans" style={{ color: "var(--foreground)" }}>Experience Management</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Showcase your career highlights and achievements.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <div className="p-6 rounded-2xl border sticky top-24" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              Add New Entry
              <span className="code-badge text-[10px]">CREATION</span>
            </h2>
            <ExperienceForm />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            Timeline History
            <span className="code-badge text-[10px]">{experiencesList.length} ITEMS</span>
          </h2>
          {experiencesList.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border-2 border-dashed flex flex-col items-center gap-4" style={{ borderColor: "var(--border)" }}>
              <Briefcase className="w-12 h-12 opacity-20" />
              <p className="text-gray-500 font-mono text-sm">NO_DATA_AVAILABLE_IN_TIMELINE</p>
            </div>
          ) : (
            experiencesList.map((exp: any) => (
              <ExperienceItem key={exp.id} exp={exp} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
