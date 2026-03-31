"use client";

import { useState } from "react";
import { createProject } from "@/app/actions/projects";
import { Plus } from "lucide-react";
import MediaPicker from "@/components/MediaPicker";

export default function ProjectForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await createProject(formData);
    
    if (result.success) {
      setMessage("Project added successfully.");
      form.reset();
      setImageUrl("");
      setFileUrl("");
    } else {

      setMessage("Failed to add project.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
        <input type="text" name="title" className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg outline-none" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
        <textarea name="description" rows={2} className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg outline-none resize-none" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (Comma separated)</label>
        <input type="text" name="tags" placeholder="React, Tailwind, Node.js" className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg outline-none" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
          <input type="url" name="githubUrl" className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live URL</label>
          <input type="url" name="liveUrl" className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg outline-none" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MediaPicker 
          label="Main Preview Image"
          type="image"
          currentUrl={imageUrl}
          onSelect={setImageUrl}
        />
        <MediaPicker 
          label="Project Assets (ZIP, PDF, etc.)"
          type="all"
          currentUrl={fileUrl}
          onSelect={setFileUrl}
        />
      </div>
      <input type="hidden" name="image" value={imageUrl} />
      <input type="hidden" name="projectFileUrl" value={fileUrl} />


      <div className="pt-2">
        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-colors">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>
    </form>
  );
}
