"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, CheckCircle2, Image as ImageIcon, Loader2, Link as LinkIcon } from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

interface ImageUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelected: (url: string) => void;
  title?: string;
  description?: string;
  currentImage?: string;
}

export default function ImageUploaderModal({
  isOpen,
  onClose,
  onImageSelected,
  title = "Upload Image via Cloudinary",
  description = "Upload a photo or asset directly to Cloudinary or specify an existing image URL.",
  currentImage,
}: ImageUploaderModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(currentImage || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUpload(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processUpload(file);
  };

  const processUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);
    setUploadProgress(20);

    try {
      setUploadProgress(50);
      const url = await uploadImageToCloudinary(file);
      setUploadProgress(100);
      setUploadedUrl(url);
      setIsUploading(false);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err?.message || "Failed to upload image to Cloudinary.");
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (activeTab === "upload" && uploadedUrl) {
      onImageSelected(uploadedUrl);
      onClose();
    } else if (activeTab === "url" && urlInput.trim()) {
      onImageSelected(urlInput.trim());
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            className="relative w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl border border-zinc-200 z-10"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold font-geist mb-2">
                <UploadCloud size={14} />
                <span>Cloudinary Connected</span>
              </div>
              <h3 className="font-geist text-xl font-bold text-zinc-950 tracking-tight">
                {title}
              </h3>
              <p className="font-geist text-xs text-zinc-500 mt-0.5">
                {description}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex rounded-xl bg-zinc-100 p-1 mb-5">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "upload"
                    ? "bg-white text-zinc-950 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                <UploadCloud size={14} />
                <span>File Upload</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("url")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "url"
                    ? "bg-white text-zinc-950 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                <LinkIcon size={14} />
                <span>Image URL</span>
              </button>
            </div>

            {/* Content Area */}
            {activeTab === "upload" ? (
              <div className="space-y-4">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                    isUploading
                      ? "border-blue-400 bg-blue-50/50"
                      : "border-zinc-300 hover:border-zinc-400 bg-zinc-50/60"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {isUploading ? (
                    <div className="flex flex-col items-center py-4">
                      <Loader2 size={32} className="animate-spin text-blue-600 mb-2" />
                      <p className="text-sm font-semibold text-zinc-800 font-geist">
                        Uploading to Cloudinary...
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">Please wait</p>
                    </div>
                  ) : uploadedUrl ? (
                    <div className="flex flex-col items-center">
                      <div className="h-28 w-28 rounded-xl overflow-hidden border border-zinc-200 mb-2 relative">
                        <img
                          src={uploadedUrl}
                          alt="Uploaded Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold font-geist">
                        <CheckCircle2 size={14} />
                        <span>Uploaded successfully!</span>
                      </div>
                      <span className="text-[11px] text-zinc-400 mt-1">
                        Click or drag another to replace
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-3">
                      <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 mb-3">
                        <ImageIcon size={22} />
                      </div>
                      <p className="text-sm font-semibold text-zinc-800 font-geist">
                        Click to browse or drop an image here
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        PNG, JPG, WEBP or SVG up to 10MB
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-xs text-red-600 font-medium text-center">
                    {error}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                    Image Direct URL
                  </label>
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://res.cloudinary.com/.../image.png"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-mono focus:border-zinc-950 focus:outline-none"
                  />
                </div>

                {urlInput && (
                  <div className="flex flex-col items-center">
                    <p className="text-xs text-zinc-500 mb-2 self-start font-geist">
                      Preview:
                    </p>
                    <div className="h-28 w-28 rounded-xl overflow-hidden border border-zinc-200">
                      <img
                        src={urlInput}
                        alt="URL Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as any).src =
                            "https://via.placeholder.com/150?text=Invalid+Image";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold font-geist text-zinc-600 hover:text-zinc-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={
                  activeTab === "upload" ? !uploadedUrl : !urlInput.trim()
                }
                className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold font-geist transition-all shadow-sm cursor-pointer"
              >
                Apply Image
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
