import { getCertifications } from "@/app/actions/certifications";
import CertificationsForm from "./CertificationsForm";
import CertificationItem from "./CertificationItem";

export default async function AdminCertificationsPage() {
  const certificationsList = await getCertifications();

  return (
    <div>
      <h1 className="text-2xl font-bold font-sans text-gray-900 dark:text-white mb-6">Manage Certifications</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Add New Certification</h2>
          <CertificationsForm />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Existing Certifications</h2>
          {certificationsList.length === 0 ? (
            <p className="text-gray-500">No certifications added yet. Fallback data will be shown.</p>
          ) : (
            certificationsList.map((cert: any) => (
              <CertificationItem key={cert.id} cert={cert} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
