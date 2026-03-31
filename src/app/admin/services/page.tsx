import { getServices, deleteService } from "@/app/actions/services";
import ServicesForm from "./ServicesForm";
import { Trash2, Layers } from "lucide-react";

export default async function AdminServicesPage() {
  const servicesList = await getServices();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>Manage Services</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: "var(--foreground)" }}>Add New Service</h2>
          <ServicesForm />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Existing Services</h2>
          {servicesList.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No services added yet. Fallback data will show on the site.</p>
          ) : (
            servicesList.map((svc: any) => (
              <div key={svc.id} className="p-4 rounded-xl border flex justify-between items-start gap-3"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                    <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{svc.title}</h3>
                    {svc.icon && <span className="code-badge ml-auto">{svc.icon}</span>}
                  </div>
                  <p className="text-xs line-clamp-2" style={{ color: "var(--muted-foreground)" }}>{svc.description}</p>
                </div>
                <form action={async () => { "use server"; await deleteService(svc.id); }}>
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
