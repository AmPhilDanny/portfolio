import { getSkillCategories, deleteSkillCategory } from "@/app/actions/skills";
import SkillsForm from "./SkillsForm";
import { Trash2, Code2 } from "lucide-react";

export default async function AdminSkillsPage() {
  const skillsList = await getSkillCategories();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>Manage Skills</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: "var(--foreground)" }}>Add Skill Category</h2>
          <SkillsForm />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Existing Categories</h2>
          {skillsList.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No skill categories yet. Fallback data will be shown on the site.</p>
          ) : (
            skillsList.map((cat: any) => (
              <div key={cat.id} className="p-4 rounded-xl border flex justify-between items-start gap-3"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                    <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{cat.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(cat.skills as string[]).map((s: string) => (
                      <span key={s} className="code-badge">{s}</span>
                    ))}
                  </div>
                </div>
                <form action={async () => { "use server"; await deleteSkillCategory(cat.id); }}>
                  <button type="submit" className="p-2 rounded-lg transition-colors text-red-500 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
