"use client";

import { useState } from "react";
import { updateAbout } from "@/app/actions/about";
import { Save } from "lucide-react";

export default function AboutForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const formData = new FormData(e.currentTarget);
    const result = await updateAbout(formData);
    
    if (result.success) {
      setMessage("About section updated successfully.");
    } else {
      setMessage("Failed to update about section.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
        <textarea 
          name="description"
          rows={10}
          defaultValue={initialData?.description || "I am a passionate and detail-oriented Certified Data Analyst and Junior Full-Stack Developer. With a strong foundation in both interpreting complex datasets and building robust web applications, I bring a unique perspective to technology solutions.\n\nMy journey in tech has equipped me with the ability to not just write clean, efficient code, but to understand the \"why\" behind the data. I thrive in environments where I can leverage my analytical skills to drive business decisions while simultaneously executing technical implementations.\n\nWhen I'm not coding or analyzing data, you can find me continuously learning new technologies and keeping up with the latest industry trends."}
          className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white resize-none"
          required
        />
      </div>
      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <button 
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
