"use client";
import { useState } from "react";
import { createExperience } from "@/app/actions/experience";
import { Plus } from "lucide-react";

export default function ExperienceForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const form = e.currentTarget;
    const result = await createExperience(new FormData(form));
    if (result.success) {
      setMessage("Experience added successfully.");
      form.reset();
    } else {
      setMessage("Failed to add experience.");
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
          <input type="text" name="role" placeholder="e.g. Senior Data Analyst" className={inputCls} style={inputStyle} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>Company</label>
          <input type="text" name="company" placeholder="e.g. Tech Solutions Inc." className={inputCls} style={inputStyle} required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>Period</label>
        <input type="text" name="period" placeholder="e.g. Jan 2022 - Present" className={inputCls} style={inputStyle} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>Description</label>
        <textarea name="description" rows={3} placeholder="Brief summary of your role..." className={inputCls} style={inputStyle} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>Achievements (one per line)</label>
        <textarea name="achievements" rows={4} placeholder="Increased data processing efficiency by 30%&#10;Led a team of 5 analysts..." className={inputCls} style={inputStyle} required />
      </div>
      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 transition-all font-mono"
        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
        {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
        Add Experience
      </button>
    </form>
  );
}
