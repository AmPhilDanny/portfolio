"use client";

import { useState, useEffect } from "react";
import { getMedia, addMedia } from "@/app/actions/media";
import { Image as ImageIcon, Upload, Search, X, Check, FileText, Video } from "lucide-react";

interface MediaPickerProps {
  onSelect: (url: string) => void;
  currentUrl?: string;
  label?: string;
  type?: 'image' | 'video' | 'document' | 'all';
}

export default function MediaPicker({ onSelect, currentUrl, label, type = 'image' }: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

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

      onSelect(blob.url);
      setIsOpen(false);
      fetchMedia();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload media");
    } finally {
      setUploading(false);
    }
  };

  const filteredMedia = mediaList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = type === 'all' || item.type === type;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      
      <div className="flex items-center gap-4">
        <div className="relative group w-24 h-24 bg-gray-100 dark:bg-zinc-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
          {currentUrl ? (
            <>
              {type === 'image' ? (
                <img src={currentUrl} alt="Selected" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <FileText className="w-8 h-8" />
                  <span className="text-[10px] mt-1 truncate max-w-[80%] px-1">{currentUrl.split('/').pop()}</span>
                </div>
              )}
              <button 
                type="button"
                onClick={() => onSelect("")}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-300" />
          )}
        </div>
        
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Choose from Library
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Media Library</h3>
                <p className="text-sm text-gray-500 mt-1">Select an asset or upload a new one</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <label className={`flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer transition-colors text-sm font-medium ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload New"}
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                  disabled={uploading}
                  accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : type === 'document' ? 'application/pdf,.doc,.docx' : '*/*'}
                />
              </label>
            </div>

            <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[1,2,3,4,5,6,7,8,9,10].map(i => (
                    <div key={i} className="aspect-square bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">No media found matching your search</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredMedia.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => {
                        onSelect(item.url);
                        setIsOpen(false);
                      }}
                      className={`group relative aspect-square rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${currentUrl === item.url ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}
                    >
                      {item.type === 'image' ? (
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-2">
                          {item.type === 'video' ? <Video className="w-6 h-6 text-gray-400" /> : <FileText className="w-6 h-6 text-gray-400" />}
                          <span className="text-[10px] text-gray-500 mt-2 truncate w-full text-center px-2">{item.name}</span>
                        </div>
                      )}
                      
                      {currentUrl === item.url && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full shadow-lg">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-1 rounded backdrop-blur-md">Select</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
