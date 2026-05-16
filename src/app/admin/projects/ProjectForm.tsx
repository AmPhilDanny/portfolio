"use client";

import { useState } from "react";
import { createProject, updateProject } from "@/app/actions/projects";
import { PlusSignIcon, FloppyDiskIcon, Cancel01Icon } from "hugeicons-react";
import MediaPicker from "@/components/MediaPicker";
import RichTextEditor from "@/components/RichTextEditor";

interface ProjectFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProjectForm({ initialData, onSuccess, onCancel }: ProjectFormProps = {}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState(initialData?.image || "");
  const [fileUrl, setFileUrl] = useState(initialData?.projectFileUrl || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const isEditMode = !!initialData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const result = isEditMode 
      ? await updateProject(initialData.id, formData)
      : await createProject(formData);
    
    if (result.success) {
      setMessage(`Project ${isEditMode ? 'updated' : 'added'} successfully.`);
      if (!isEditMode) {
        form.reset();
        setImageUrl("");
        setFileUrl("");
        setDescription("");
      }
      if (onSuccess) onSuccess();
    } else {
      setMessage(`Failed to ${isEditMode ? 'update' : 'add'} project.`);
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
        <input type="text" name="title" defaultValue={initialData?.title} className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg outline-none" required />
      </div>
      
      <RichTextEditor 
        label="Description"
        content={description}
        onChange={setDescription}
      />
      <input type="hidden" name="description" value={description} />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (Comma separated)</label>
        <input type="text" name="tags" defaultValue={initialData?.tags?.join(", ")} placeholder="React, Tailwind, Node.js" className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg outline-none" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
          <input type="url" name="githubUrl" defaultValue={initialData?.githubUrl} className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live URL</label>
          <input type="url" name="liveUrl" defaultValue={initialData?.liveUrl} className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg outline-none" />
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

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-colors">
          {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (isEditMode ? <FloppyDiskIcon className="w-4 h-4" /> : <PlusSignIcon className="w-4 h-4" />)}
          {isEditMode ? "Save Changes" : "Add Project"}
        </button>
        {isEditMode && onCancel && (
          <button type="button" onClick={onCancel} disabled={loading} className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-gray-300 rounded-lg transition-colors">
            <Cancel01Icon className="w-4 h-4" /> Cancel
          </button>
        )}
      </div>
    </form>
  );
}
