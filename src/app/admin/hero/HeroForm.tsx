"use client";

import { useState } from "react";
import { updateHero } from "@/app/actions/hero";
import { Save } from "lucide-react";
import MediaPicker from "@/components/MediaPicker";

export default function HeroForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "/profile.jpg");
  const [cvUrl, setCvUrl] = useState(initialData?.cvUrl || "/resume.pdf");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const formData = new FormData(e.currentTarget);
    const result = await updateHero(formData);
    
    if (result.success) {
      setMessage("Hero section updated successfully.");
    } else {
      setMessage("Failed to update hero section.");
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
        <input 
          type="text" 
          name="name"
          defaultValue={initialData?.name || "Amaechi Philip Ekaba"}
          className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
        <input 
          type="text" 
          name="title"
          defaultValue={initialData?.title || "Certified Data Analyst & Junior Full-Stack Developer"}
          className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
        <textarea 
          name="description"
          rows={4}
          defaultValue={initialData?.description || "Transforming complex data into actionable insights and building modern, responsive web applications. Passionate about solving problems at the intersection of data and development."}
          className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white resize-none"
          required
        />
      </div>
      
      <MediaPicker 
        label="CV/Resume Document"
        type="document"
        currentUrl={cvUrl}
        onSelect={setCvUrl}
      />
      <input type="hidden" name="cvUrl" value={cvUrl} />

      <MediaPicker 
        label="Profile Image"
        type="image"
        currentUrl={imageUrl}
        onSelect={setImageUrl}
      />
      <input type="hidden" name="imageUrl" value={imageUrl} />

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
