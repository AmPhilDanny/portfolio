import { getContact } from "@/app/actions/contact";
import ContactForm from "./ContactForm";
import { Mail, ShieldCheck } from "lucide-react";

export default async function AdminContactPage() {
  const contactData = await getContact();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-sans" style={{ color: "var(--foreground)" }}>Contact Details</h1>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Maintain your reachability information.</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 text-green-600 text-[10px] font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3 h-3" />
          PUBLICLY_DISPLAYED
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="p-8 rounded-2xl border tech-card-glow transition-all" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              Update Master Information
              <span className="code-badge text-[10px]">CORE_DATA</span>
            </h2>
            <ContactForm initialData={contactData} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl border bg-primary/5 border-primary/10 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary/60">System Information</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50 font-mono">Last Update</span>
                <span className="text-xs font-mono font-bold" style={{ color: "var(--foreground)" }}>
                  {contactData ? new Date().toLocaleDateString() : "NEVER_INITIALIZED"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50 font-mono">Visibility Status</span>
                <span className="text-xs font-mono font-bold text-green-500">VISIBLE_ON_MAIN_SITE</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-dashed flex flex-col gap-3" style={{ borderColor: "var(--border)" }}>
             <p className="text-[10px] font-bold text-muted-foreground uppercase font-mono">Quick Tip</p>
             <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                These contact details are used in the contact section of your home page. Ensure they are up-to-date to avoid missed opportunities.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
