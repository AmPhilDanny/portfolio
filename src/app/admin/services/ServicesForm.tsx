"use client";
import { useState } from "react";
import { createService } from "@/app/actions/services";
import { Plus } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";

export default function ServicesForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Code");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const form = e.currentTarget;
    const result = await createService(new FormData(form));
    if (result.success) { 
      setMessage("Service added."); 
      form.reset(); 
      setSelectedIcon("Code"); 
      setDescription("");
    }
    else setMessage("Failed to add service.");
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
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>Service Title</label>
        <input type="text" name="title" placeholder="e.g. Data Analysis & Visualization" className={inputCls} style={inputStyle} required />
      </div>
      
      <RichTextEditor 
        label="Description"
        content={description}
        onChange={setDescription}
      />
      <input type="hidden" name="description" value={description} />

      <div>
        <label className="block text-sm font-medium mb-1.5 flex items-center justify-between" style={{ color: "var(--muted-foreground)" }}>
          Icon (Lucide name)
          <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Browse Icons</a>
        </label>
        <input 
          type="text" 
          name="icon" 
          value={selectedIcon}
          onChange={(e) => setSelectedIcon(e.target.value)}
          placeholder="e.g. bar-chart-3"
          className={inputCls} 
          style={inputStyle} 
          required 
        />
        <p className="mt-1.5 text-[10px] text-muted-foreground italic">Tip: Use kebab-case names from the Lucide library.</p>
      </div>
      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 transition-all"
        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
        {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
        Add Service
      </button>
    </form>
  );
}
