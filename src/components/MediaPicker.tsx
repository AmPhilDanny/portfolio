"use client";

import { useState, useEffect, useRef } from "react";
import { getMedia, addMedia } from "@/app/actions/media";
import {
  Image as ImageIcon,
  Upload,
  Search,
  X,
  Check,
  FileText,
  Video,
  CloudUpload,
  FolderOpen,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: string | null;
}

interface MediaPickerProps {
  onSelect: (url: string) => void;
  currentUrl?: string;
  label?: string;
  type?: "image" | "video" | "document" | "all";
}

export default function MediaPicker({
  onSelect,
  currentUrl,
  label,
  type = "image",
}: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"gallery" | "upload">("gallery");
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && activeTab === "gallery") fetchMedia();
  }, [isOpen, activeTab]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const data = await getMedia();
      setMediaList(data as MediaItem[]);
    } catch {
      setMediaList([]);
    }
    setLoading(false);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    setUploadProgress(10);

    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(safeName)}`, {
        method: "POST",
        body: file,
        headers: { "Content-Type": file.type },
      });

      setUploadProgress(70);

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(err.error || "Upload failed");
      }

      const result = await response.json();
      setUploadProgress(90);

      const fileType = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : "document";

      await addMedia({
        name: file.name,
        url: result.url,
        type: fileType,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      });

      setUploadProgress(100);
      onSelect(result.url);

      // Switch to gallery and refresh
      setTimeout(() => {
        setActiveTab("gallery");
        fetchMedia();
        setUploadProgress(0);
      }, 600);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setUploadError(message);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const acceptAttr =
    type === "image"
      ? "image/*"
      : type === "video"
      ? "video/*"
      : type === "document"
      ? "application/pdf,.doc,.docx"
      : "*/*";

  const filteredMedia = mediaList.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = type === "all" || item.type === type;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>
          {label}
        </label>
      )}

      {/* Trigger row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Preview thumbnail */}
        <div
          className="relative group w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer transition-all"
          style={{
            borderColor: currentUrl ? "var(--primary)" : "var(--border)",
            background: "var(--muted)",
          }}
          onClick={() => setIsOpen(true)}
        >
          {currentUrl ? (
            <>
              {type === "image" ? (
                <img src={currentUrl} alt="Selected" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1 p-2">
                  <FileText className="w-6 h-6" style={{ color: "var(--primary)" }} />
                  <span className="text-[9px] truncate w-full text-center" style={{ color: "var(--muted-foreground)" }}>
                    {currentUrl.split("/").pop()}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">Change</span>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onSelect(""); }}
                className="absolute top-1 right-1 p-0.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <ImageIcon className="w-6 h-6" style={{ color: "var(--muted-foreground)" }} />
              <span className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>No file</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => { setActiveTab("gallery"); setIsOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <FolderOpen className="w-4 h-4" style={{ color: "var(--primary)" }} />
            Choose from Gallery
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("upload"); setIsOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "var(--primary)",
              borderColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            <CloudUpload className="w-4 h-4" />
            Upload New File
          </button>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog */}
          <div
            className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b shrink-0"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <h3 className="text-lg font-bold" style={{ color: "var(--card-foreground)" }}>
                  Media Manager
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  Upload a new file or choose from your library
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: "var(--muted-foreground)" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div
              className="flex border-b shrink-0"
              style={{ borderColor: "var(--border)", background: "var(--muted)" }}
            >
              {(["gallery", "upload"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-medium capitalize transition-all"
                  style={{
                    color: activeTab === tab ? "var(--primary)" : "var(--muted-foreground)",
                    borderBottom: activeTab === tab ? "2px solid var(--primary)" : "2px solid transparent",
                    background: "transparent",
                  }}
                >
                  {tab === "gallery" ? <FolderOpen className="w-4 h-4" /> : <CloudUpload className="w-4 h-4" />}
                  {tab === "gallery" ? "Gallery" : "Upload"}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto">
              {/* ─── GALLERY TAB ─── */}
              {activeTab === "gallery" && (
                <div className="p-6 space-y-4">
                  {/* Search */}
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border"
                    style={{ background: "var(--muted)", borderColor: "var(--border)" }}
                  >
                    <Search className="w-4 h-4 shrink-0" style={{ color: "var(--muted-foreground)" }} />
                    <input
                      type="text"
                      placeholder="Search your library..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-sm"
                      style={{ color: "var(--foreground)" }}
                    />
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-xl animate-pulse"
                          style={{ background: "var(--muted)" }}
                        />
                      ))}
                    </div>
                  ) : filteredMedia.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                      <ImageIcon className="w-12 h-12" style={{ color: "var(--border)" }} />
                      <p style={{ color: "var(--muted-foreground)" }}>
                        {searchQuery ? "No assets match your search" : "No media uploaded yet"}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab("upload")}
                        className="text-sm font-medium underline"
                        style={{ color: "var(--primary)" }}
                      >
                        Upload your first file
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {filteredMedia.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => { onSelect(item.url); setIsOpen(false); }}
                          className="group relative aspect-square rounded-xl border-2 overflow-hidden transition-all duration-200 hover:scale-[1.03]"
                          style={{
                            borderColor: currentUrl === item.url ? "var(--primary)" : "var(--border)",
                            boxShadow: currentUrl === item.url ? "0 0 0 3px var(--glow-primary)" : "none",
                          }}
                        >
                          {item.type === "image" ? (
                            <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div
                              className="w-full h-full flex flex-col items-center justify-center gap-1 p-2"
                              style={{ background: "var(--muted)" }}
                            >
                              {item.type === "video" ? (
                                <Video className="w-7 h-7" style={{ color: "var(--muted-foreground)" }} />
                              ) : (
                                <FileText className="w-7 h-7" style={{ color: "var(--muted-foreground)" }} />
                              )}
                              <span className="text-[9px] truncate w-full text-center px-1" style={{ color: "var(--muted-foreground)" }}>
                                {item.name}
                              </span>
                            </div>
                          )}

                          {currentUrl === item.url && (
                            <div
                              className="absolute top-1.5 right-1.5 p-1 rounded-full shadow"
                              style={{ background: "var(--primary)" }}
                            >
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                            <p className="w-full px-2 py-1 text-[9px] text-white truncate">
                              {item.name}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ─── UPLOAD TAB ─── */}
              {activeTab === "upload" && (
                <div className="p-6 space-y-4">
                  {/* Dropzone */}
                  <div
                    className="relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: dragOver ? "var(--primary)" : "var(--border)",
                      background: dragOver ? "var(--glow-primary)" : "var(--muted)",
                    }}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept={acceptAttr}
                      onChange={handleFileInputChange}
                      disabled={uploading}
                    />

                    {uploading ? (
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin" style={{ color: "var(--primary)" }} />
                        <p className="font-medium" style={{ color: "var(--foreground)" }}>Uploading...</p>
                        <div
                          className="w-full max-w-xs rounded-full overflow-hidden"
                          style={{ height: "4px", background: "var(--border)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${uploadProgress}%`,
                              background: "linear-gradient(90deg, var(--primary), var(--secondary))",
                            }}
                          />
                        </div>
                        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                          {uploadProgress}% complete
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center"
                          style={{ background: "var(--glow-primary)", border: "1px solid var(--border)" }}
                        >
                          <Upload className="w-8 h-8" style={{ color: "var(--primary)" }} />
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: "var(--foreground)" }}>
                            Drop your file here, or{" "}
                            <span style={{ color: "var(--primary)" }}>browse</span>
                          </p>
                          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                            {type === "image"
                              ? "PNG, JPG, GIF, WEBP, SVG"
                              : type === "video"
                              ? "MP4, MOV, WebM"
                              : type === "document"
                              ? "PDF, DOC, DOCX"
                              : "Any file type"}
                            {" · "}Max 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Error */}
                  {uploadError && (
                    <div
                      className="flex items-center gap-3 p-4 rounded-xl border"
                      style={{
                        background: "rgba(239,68,68,0.08)",
                        borderColor: "rgba(239,68,68,0.3)",
                        color: "#ef4444",
                      }}
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Upload Failed</p>
                        <p className="text-xs mt-0.5 opacity-80">{uploadError}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadError("")}
                        className="ml-auto p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Paste URL section */}
                  <div
                    className="p-4 rounded-xl border space-y-2"
                    style={{ background: "var(--muted)", borderColor: "var(--border)" }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
                      Or paste a URL directly
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        id="paste-url-input"
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-3 py-2 rounded-lg text-sm border outline-none transition-colors"
                        style={{
                          background: "var(--card)",
                          borderColor: "var(--border)",
                          color: "var(--foreground)",
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) { onSelect(val); setIsOpen(false); }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("paste-url-input") as HTMLInputElement;
                          const val = input?.value.trim();
                          if (val) { onSelect(val); setIsOpen(false); }
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{
                          background: "var(--primary)",
                          color: "var(--primary-foreground)",
                        }}
                      >
                        Use URL
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
