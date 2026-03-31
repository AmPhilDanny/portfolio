import { getExperiences, deleteExperience } from "@/app/actions/experience";
import ExperienceForm from "./ExperienceForm";
import { Trash2, Briefcase } from "lucide-react";

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
              <div key={exp.id} className="p-5 rounded-2xl border transition-all tech-card-glow"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg" style={{ color: "var(--foreground)" }}>{exp.role}</h3>
                      <span className="code-badge">{exp.period}</span>
                    </div>
                    <p className="font-semibold text-primary mb-3">{exp.company}</p>
                    <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{exp.description}</p>
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Key Achievements</p>
                      <ul className="grid grid-cols-1 gap-2">
                        {(exp.achievements as string[]).map((ach: string, i: number) => (
                          <li key={i} className="text-xs flex items-start gap-2" style={{ color: "var(--foreground)" }}>
                            <span className="text-primary font-mono select-none">→</span>
                            {ach}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <form action={async () => { "use server"; await deleteExperience(exp.id); }}>
                    <button type="submit" className="p-2 rounded-lg transition-colors text-red-500 hover:bg-red-500/10 group">
                      <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
