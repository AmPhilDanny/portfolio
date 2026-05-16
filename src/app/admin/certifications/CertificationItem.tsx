"use client";
import React, { useState } from "react";
import { Delete02Icon, PencilEdit01Icon } from "hugeicons-react";
import { deleteCertification } from "@/app/actions/certifications";
import CertificationsForm from "./CertificationsForm";

export default function CertificationItem({ cert }: { cert: any }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl transition-all">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
          Edit Certification
          <span className="px-2 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full uppercase font-bold">Editing</span>
        </h3>
        <CertificationsForm 
          initialData={cert} 
          onSuccess={() => setIsEditing(false)} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl flex justify-between items-center transition-all hover:border-primary/30 group">
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{cert.name}</h3>
        <p className="text-sm text-gray-500">{cert.issuer} &bull; {cert.date}</p>
      </div>
      <div className="flex gap-1 shrink-0 ml-4">
        <button 
          onClick={() => setIsEditing(true)}
          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
          title="Edit Certification"
        >
          <PencilEdit01Icon className="w-5 h-5" />
        </button>
        <form action={async () => { if(confirm("Delete certification?")) await deleteCertification(cert.id); }}>
          <button type="submit" className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer">
            <Delete02Icon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
