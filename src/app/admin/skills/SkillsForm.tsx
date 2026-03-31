"use client";
import { useState } from "react";
import { createSkillCategory } from "@/app/actions/skills";
import { Plus } from "lucide-react";

export default function SkillsForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const form = e.currentTarget;
    const result = await createSkillCategory(new FormData(form));
    if (result.success) { setMessage("Skill category added."); form.reset(); }
    else setMessage("Failed to add category.");
    setLoading(false);
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors";
  const inputStyle = { background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-3 rounded-xl text-sm border ${message.includes("added") ? "border-green-500/30 text-green-600" : "border-red-500/30 text-red-500"}`}
          style={{ background: message.includes("added") ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)" }}>
          {message}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>Category Name</label>
        <input type="text" name="category" placeholder="e.g. Data Analysis" className={inputCls} style={inputStyle} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>Skills (comma-separated)</label>
        <input type="text" name="skills" placeholder="Python, SQL, Tableau, Power BI" className={inputCls} style={inputStyle} required />
        <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>Separate each skill with a comma</p>
      </div>
      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 transition-all"
        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
        {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
        Add Category
      </button>
    </form>
  );
}
