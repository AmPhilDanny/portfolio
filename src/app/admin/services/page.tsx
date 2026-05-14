import { getServices } from "@/app/actions/services";
import ServicesForm from "./ServicesForm";
import ServiceItem from "./ServiceItem";

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
              <ServiceItem key={svc.id} svc={svc} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
