"use client";
import { useState } from "react";
import { updateContact } from "@/app/actions/contact";
import { Save, Mail, Phone, MapPin } from "lucide-react";

export default function ContactForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const result = await updateContact(new FormData(e.currentTarget));
    if (result.success) {
      setMessage("Contact details saved successfully.");
    } else {
      setMessage("Failed to save contact details.");
    }
    setLoading(false);
  };

  const inputCls = "w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors focus:border-primary";
  const inputStyle = { background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium border ${message.includes("success") ? "border-green-500/30 text-green-600" : "border-red-500/30 text-red-500"}`}
          style={{ background: message.includes("success") ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)" }}>
          {message}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="relative">
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: "var(--muted-foreground)" }}>
            Primary Email
          </label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary transition-transform group-hover:scale-110" />
            <input 
              type="email" 
              name="email" 
              defaultValue={initialData?.email || ""} 
              placeholder="hello@example.com"
              className={inputCls} 
              style={inputStyle} 
              required 
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: "var(--muted-foreground)" }}>
            Phone Number
          </label>
          <div className="relative group">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary transition-transform group-hover:scale-110" />
            <input 
              type="tel" 
              name="phone" 
              defaultValue={initialData?.phone || ""} 
              placeholder="+1 (234) 567-890"
              className={inputCls} 
              style={inputStyle} 
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: "var(--muted-foreground)" }}>
            Location
          </label>
          <div className="relative group">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary transition-transform group-hover:scale-110" />
            <input 
              type="text" 
              name="location" 
              defaultValue={initialData?.location || ""} 
              placeholder="City, Country"
              className={inputCls} 
              style={inputStyle} 
              required 
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <button 
          type="submit" 
          disabled={loading} 
          className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {loading ? "Updating..." : "Save Contact Info"}
        </button>
      </div>
    </form>
  );
}
