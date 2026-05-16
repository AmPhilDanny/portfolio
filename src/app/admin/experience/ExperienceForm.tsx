"use client";
import { useState } from "react";
import { createExperience, updateExperience } from "@/app/actions/experience";
import { PlusSignIcon as Plus, FloppyDiskIcon as Save, Cancel01Icon as X } from "hugeicons-react";
import RichTextEditor from "@/components/RichTextEditor";

interface ExperienceFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ExperienceForm({ initialData, onSuccess, onCancel }: ExperienceFormProps = {}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState(initialData?.description || "");
  
  const isEditMode = !!initialData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const form = e.currentTarget;
    
    const result = isEditMode 
      ? await updateExperience(initialData.id, new FormData(form))
      : await createExperience(new FormData(form));
      
    if (result.success) {
      setMessage(`Experience ${isEditMode ? 'updated' : 'added'} successfully.`);
      if (!isEditMode) {
        form.reset();
        setDescription("");
      }
      if (onSuccess) onSuccess();
    } else {
      setMessage(`Failed to ${isEditMode ? 'update' : 'add'} experience.`);
    }
    setLoading(false);
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors";
  const inputStyle = { background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-3 rounded-xl text-sm border ${message.includes("success") ? "border-green-500/30 text-green-600" : "border-red-500/30 text-red-500"}`}
          style={{ background: message.includes("success") ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)" }}>
          {message}
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>Role</label>
          <input type="text" name="role" defaultValue={initialData?.role} placeholder="e.g. Senior Data Analyst" className={inputCls} style={inputStyle} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>Company</label>
          <input type="text" name="company" defaultValue={initialData?.company} placeholder="e.g. Tech Solutions Inc." className={inputCls} style={inputStyle} required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>Period</label>
        <input type="text" name="period" defaultValue={initialData?.period} placeholder="e.g. Jan 2022 - Present" className={inputCls} style={inputStyle} required />
      </div>
      
      <RichTextEditor 
        label="Description"
        content={description}
        onChange={setDescription}
      />
      <input type="hidden" name="description" value={description} />

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>Achievements (one per line)</label>
        <textarea name="achievements" defaultValue={initialData?.achievements?.join('\n')} rows={4} placeholder="Increased data processing efficiency by 30%&#10;Led a team of 5 analysts..." className={inputCls} style={inputStyle} required />
      </div>
      
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 transition-all font-mono"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
          {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (isEditMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
          {isEditMode ? "Save Changes" : "Add Experience"}
        </button>
        
        {isEditMode && onCancel && (
          <button type="button" onClick={onCancel} disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-gray-300">
            <X className="w-4 h-4" />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
