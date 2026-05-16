"use client";
import { useState } from "react";
import { createSkillCategory, updateSkillCategory } from "@/app/actions/skills";
import { PlusSignIcon, FloppyDiskIcon, Cancel01Icon } from "hugeicons-react";

interface SkillsFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SkillsForm({ initialData, onSuccess, onCancel }: SkillsFormProps = {}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const isEditMode = !!initialData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const form = e.currentTarget;
    
    const result = isEditMode
      ? await updateSkillCategory(initialData.id, new FormData(form))
      : await createSkillCategory(new FormData(form));

    if (result.success) { 
      setMessage(`Skill category ${isEditMode ? 'updated' : 'added'}.`); 
      if (!isEditMode) form.reset(); 
      if (onSuccess) onSuccess();
    }
    else setMessage(`Failed to ${isEditMode ? 'update' : 'add'} category.`);
    setLoading(false);
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors";
  const inputStyle = { background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-3 rounded-xl text-sm border ${message.includes("added") || message.includes("updated") ? "border-green-500/30 text-green-600" : "border-red-500/30 text-red-500"}`}
          style={{ background: message.includes("added") || message.includes("updated") ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)" }}>
          {message}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>Category Name</label>
        <input type="text" name="category" defaultValue={initialData?.category} placeholder="e.g. Data Analysis" className={inputCls} style={inputStyle} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>Skills (comma-separated)</label>
        <input type="text" name="skills" defaultValue={initialData?.skills?.join(", ")} placeholder="Python, SQL, Tableau, Power BI" className={inputCls} style={inputStyle} required />
        <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>Separate each skill with a comma</p>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 transition-all"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
          {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (isEditMode ? <FloppyDiskIcon className="w-4 h-4" /> : <PlusSignIcon className="w-4 h-4" />)}
          {isEditMode ? "Save Changes" : "Add Category"}
        </button>
        {isEditMode && onCancel && (
          <button type="button" onClick={onCancel} disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-gray-300">
            <Cancel01Icon className="w-4 h-4" /> Cancel
          </button>
        )}
      </div>
    </form>
  );
}
