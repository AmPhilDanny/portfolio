"use client";

import { useState, useEffect } from "react";
import { getMedia, addMedia, deleteMedia } from "@/app/actions/media";
import { Upload, Trash2, ExternalLink, FileText, Image as ImageIcon, Video, Search } from "lucide-react";
import Image from "next/image";

export default function MediaManager() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    const data = await getMedia();
    setMediaList(data);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) throw new Error('Upload failed');

      const blob = await response.json();
      
      const fileType = file.type.startsWith('image/') ? 'image' : 
                       file.type.startsWith('video/') ? 'video' : 'document';
      
      const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

      await addMedia({
        name: file.name,
        url: blob.url,
        type: fileType,
        size: sizeStr
      });

      fetchMedia();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload media");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return;
    
    const result = await deleteMedia(id);
    if (result.success) {
      fetchMedia();
    } else {
      alert("Failed to delete media");
    }
  };

  const filteredMedia = mediaList.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-8 h-8" />;
      case 'video': return <Video className="w-8 h-8" />;
      default: return <FileText className="w-8 h-8" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Media Library</h1>
          <p className="text-gray-500 mt-1 text-sm">Upload and manage all your portfolio assets</p>
        </div>
        
        <label className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors font-medium ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload New"}
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileUpload} 
            disabled={uploading}
            accept="image/*,video/*,application/pdf,.doc,.docx"
          />
        </label>
      </div>

      {/* Search and Filters */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text"
          placeholder="Search media by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="aspect-square bg-gray-200 dark:bg-zinc-800 rounded-xl" />
          ))}
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No media found</h3>
          <p className="text-gray-500 text-sm mt-1">Upload your first asset to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div 
              key={item.id} 
              className="group relative bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="aspect-square relative bg-gray-50 dark:bg-zinc-950 flex items-center justify-center overflow-hidden">
                {item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="text-gray-400">
                    {getFileIcon(item.type)}
                  </div>
                )}
                
                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={() => window.open(item.url, '_blank')}
                    className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-colors"
                    title="View full size"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md rounded-lg text-red-200 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-3">
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate" title={item.name}>
                  {item.name}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{item.type}</span>
                  <span className="text-[10px] text-gray-500">{item.size}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
