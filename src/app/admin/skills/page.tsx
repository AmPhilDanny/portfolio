import { getSkillCategories } from "@/app/actions/skills";
import SkillsForm from "./SkillsForm";
import SkillItem from "./SkillItem";

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
              <SkillItem key={cat.id} cat={cat} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
