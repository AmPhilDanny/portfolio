"use client";

import { useState } from "react";
import { updateAbout } from "@/app/actions/about";
import { Save, Plus, Trash2 } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";

export default function AboutForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState(initialData?.description || "");
  
  const [stats, setStats] = useState<any[]>(initialData?.stats || [
    { label: "Years of Data Exp.", value: "2+" },
    { label: "Projects Completed", value: "20+" }
  ]);

  const [features, setFeatures] = useState<any[]>(initialData?.features || [
    { name: "Data Analysis", description: "", icon: "LineChart" },
    { name: "Frontend Development", description: "", icon: "Code" },
    { name: "Backend Systems", description: "", icon: "Server" },
    { name: "Database Management", description: "", icon: "Database" }
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const formData = new FormData(e.currentTarget);
    formData.set("description", description);
    formData.set("stats", JSON.stringify(stats));
    formData.set("features", JSON.stringify(features));

    const result = await updateAbout(formData);
    
    if (result.success) {
      setMessage("About section updated successfully.");
    } else {
      setMessage("Failed to update about section.");
    }
    setLoading(false);
  };

  const addStat = () => setStats([...stats, { label: "", value: "" }]);
  const removeStat = (index: number) => setStats(stats.filter((_, i) => i !== index));
  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...stats];
    newStats[index][field] = value;
    setStats(newStats);
  };

  const addFeature = () => setFeatures([...features, { name: "", description: "", icon: "Code" }]);
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));
  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setFeatures(newFeatures);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message && (
        <div className={`p-4 rounded-lg text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      
      <RichTextEditor 
        label="Main Description"
        content={description}
        onChange={setDescription}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Stats</h3>
          <button type="button" onClick={addStat} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
            <Plus className="w-4 h-4" /> Add Stat
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex gap-2 items-end p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">Label</label>
                <input 
                  type="text" 
                  value={stat.label} 
                  onChange={(e) => updateStat(idx, 'label', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                />
              </div>
              <div className="w-24">
                <label className="block text-xs font-medium mb-1">Value</label>
                <input 
                  type="text" 
                  value={stat.value} 
                  onChange={(e) => updateStat(idx, 'value', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                />
              </div>
              <button type="button" onClick={() => removeStat(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Feature Cards</h3>
          <button type="button" onClick={addFeature} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
            <Plus className="w-4 h-4" /> Add Feature
          </button>
        </div>
        <div className="space-y-4">
          {features.map((feature, idx) => (
            <div key={idx} className="p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-2 gap-4 flex-1 mr-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Name</label>
                    <input 
                      type="text" 
                      value={feature.name} 
                      onChange={(e) => updateFeature(idx, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 flex items-center justify-between">
                      Icon (Lucide name)
                      <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline">Browse Icons</a>
                    </label>
                    <input 
                      type="text" 
                      value={feature.icon} 
                      placeholder="e.g. bar-chart-3"
                      onChange={(e) => updateFeature(idx, 'icon', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <button type="button" onClick={() => removeFeature(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Short Description</label>
                <textarea 
                  value={feature.description} 
                  onChange={(e) => updateFeature(idx, 'description', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
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
