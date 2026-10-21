"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, UploadCloud } from "lucide-react";
import { useAdmin, type CertificationItem } from "@/context/admin-context";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

interface CertificationEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCert?: CertificationItem;
  editIndex?: number;
}

export default function CertificationEditModal({
  isOpen,
  onClose,
  initialCert,
  editIndex,
}: CertificationEditModalProps) {
  const { addCertification, updateCertification } = useAdmin();

  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [description, setDescription] = useState("");
  const [src, setSrc] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCert) {
      setTitle(initialCert.title || "");
      setIssuer(initialCert.issuer || "");
      setDate(initialCert.date || "");
      setCredentialId(initialCert.credentialId || "");
      setDescription(initialCert.description || "");
      setSrc(initialCert.src || "");
    } else {
      setTitle("");
      setIssuer("");
      setDate("2024");
      setCredentialId(`CRED-${Math.floor(1000 + Math.random() * 9000)}`);
      setDescription("");
      setSrc("");
    }
  }, [initialCert, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImageToCloudinary(file);
      setSrc(url);
      setIsUploading(false);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload to Cloudinary");
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const certItem: CertificationItem = {
      id: credentialId || `cert-${Date.now()}`,
      title: title.trim(),
      issuer: issuer.trim(),
      date: date.trim(),
      credentialId: credentialId.trim(),
      description: description.trim(),
      src: src.trim() || "/images/placeholder-project.svg",
    };

    if (editIndex !== undefined && initialCert) {
      updateCertification(editIndex, certItem);
    } else {
      addCertification(certItem);
    }
    onClose();
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
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl border border-zinc-200 z-10"
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold font-geist mb-2">
                <Award size={13} />
                <span>Verified Credential Editor</span>
              </div>
              <h3 className="font-geist text-xl font-bold text-zinc-950 tracking-tight">
                {editIndex !== undefined ? "Edit Credential Details" : "Add Credential Box"}
              </h3>
              <p className="font-geist text-xs text-zinc-500">
                Update the certificate title, issuer metadata, description, and upload certificate preview photo.
              </p>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                  Certification Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AWS Solutions Architect, Google UX Design"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-geist focus:border-zinc-950 focus:outline-none"
                />
              </div>

              {/* Issuer & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                    Issuer Organization
                  </label>
                  <input
                    type="text"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    placeholder="e.g. Google (Coursera)"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm font-geist focus:border-zinc-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                    Year / Date
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. 2024"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm font-geist focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>

              {/* Credential ID */}
              <div>
                <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                  Credential ID
                </label>
                <input
                  type="text"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder="e.g. GOOGLE-UX-2023"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm font-mono focus:border-zinc-950 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Verified credential description..."
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm font-geist focus:border-zinc-950 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Certificate Image */}
              <div>
                <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1.5">
                  Certificate Image Box (Cloudinary)
                </label>
                <label className="border-2 border-dashed border-zinc-200 hover:border-zinc-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-zinc-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {isUploading ? (
                    <p className="text-xs text-blue-600 font-semibold font-geist">
                      Uploading certificate to Cloudinary...
                    </p>
                  ) : src ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={src}
                        alt="Preview"
                        className="w-16 h-12 object-cover rounded-lg border border-zinc-200"
                      />
                      <div className="text-left">
                        <p className="text-xs font-semibold text-emerald-600">
                          Image ready!
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          Click to upload replacement
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-2">
                      <UploadCloud size={20} className="text-zinc-400 mb-1" />
                      <span className="text-xs font-semibold text-zinc-700">
                        Click to upload certificate preview image
                      </span>
                    </div>
                  )}
                </label>

                {uploadError && (
                  <p className="text-xs text-red-600 mt-1">{uploadError}</p>
                )}

                <div className="mt-2">
                  <input
                    type="text"
                    value={src}
                    onChange={(e) => setSrc(e.target.value)}
                    placeholder="Or paste direct image URL (https://...)"
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-7 pt-4 border-t border-zinc-100">
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
                disabled={!title.trim()}
                className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold font-geist transition-all shadow-sm cursor-pointer"
              >
                {editIndex !== undefined ? "Save Credential" : "Add to Carousel"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
