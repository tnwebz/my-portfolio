"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderGit2, UploadCloud, Plus, Trash2 } from "lucide-react";
import { useAdmin, type ProjectItem } from "@/context/admin-context";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

interface ProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProject?: ProjectItem;
  editIndex?: number;
}

export default function ProjectEditModal({
  isOpen,
  onClose,
  initialProject,
  editIndex,
}: ProjectEditModalProps) {
  const { addProject, updateProject } = useAdmin();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techInput, setTechInput] = useState("");
  const [techTags, setTechTags] = useState<string[]>([]);
  const [image, setImage] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (initialProject) {
      setTitle(initialProject.title || "");
      setDescription(initialProject.description || "");
      setTechTags(initialProject.tech || []);
      setImage(initialProject.image || "");
      setLiveUrl(initialProject.liveUrl || "");
      setGithubUrl(initialProject.githubUrl || "");
      setFeatured(!!initialProject.featured);
      setProblem(initialProject.problem || "");
      setSolution(initialProject.solution || "");
    } else {
      setTitle("");
      setDescription("");
      setTechTags(["React", "TypeScript", "Node.js"]);
      setImage("");
      setLiveUrl("#");
      setGithubUrl("#");
      setFeatured(false);
      setProblem("");
      setSolution("");
    }
  }, [initialProject, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImageToCloudinary(file);
      setImage(url);
      setIsUploading(false);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload to Cloudinary");
      setIsUploading(false);
    }
  };

  const handleAddTech = () => {
    if (techInput.trim() && !techTags.includes(techInput.trim())) {
      setTechTags([...techTags, techInput.trim()]);
      setTechInput("");
    }
  };

  const handleRemoveTech = (tag: string) => {
    setTechTags(techTags.filter((t) => t !== tag));
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const projectData: ProjectItem = {
      title: title.trim(),
      description: description.trim(),
      tech: techTags.length > 0 ? techTags : ["React", "TypeScript"],
      image: image.trim() || "/images/placeholder-project.svg",
      liveUrl: liveUrl.trim() || "#",
      githubUrl: githubUrl.trim() || "#",
      featured,
      problem: problem.trim() || "Complex system requirements and UI architecture constraints.",
      solution: solution.trim() || "Engineered scalable high-performance components with clean design.",
    };

    if (editIndex !== undefined && initialProject) {
      updateProject(editIndex, projectData);
    } else {
      addProject(projectData);
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
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl border border-zinc-200 z-10"
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold font-geist mb-2">
                <FolderGit2 size={13} />
                <span>Feature Project Editor</span>
              </div>
              <h3 className="font-geist text-xl font-bold text-zinc-950 tracking-tight">
                {editIndex !== undefined ? "Edit Project Details" : "Create New Project Box"}
              </h3>
              <p className="font-geist text-xs text-zinc-500">
                Upload a cover screenshot to Cloudinary and configure project description, tech stack, and links.
              </p>
            </div>

            <div className="space-y-4">
              {/* Title & Featured */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. NextGen SaaS Platform"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-geist focus:border-zinc-950 focus:outline-none"
                  />
                </div>
                <div className="pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="h-4 w-4 rounded text-zinc-950 border-zinc-300 focus:ring-zinc-950"
                    />
                    <span className="text-xs font-semibold font-geist text-zinc-800">
                      Featured
                    </span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A comprehensive architectural solution built with modern stack..."
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm font-geist focus:border-zinc-950 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Tech Stack Tags */}
              <div>
                <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                  Tech Stack Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    placeholder="Add tag (e.g. Next.js, Stripe, Docker)"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-geist focus:border-zinc-950 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold font-geist cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {techTags.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-medium font-geist"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="text-zinc-400 hover:text-red-600 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="text"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-mono focus:border-zinc-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                    GitHub Repo URL
                  </label>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-mono focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>

              {/* Project Image Box via Cloudinary */}
              <div>
                <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1.5">
                  Project Cover Image (Cloudinary)
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
                      Uploading cover image to Cloudinary...
                    </p>
                  ) : image ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={image}
                        alt="Preview"
                        className="w-20 h-14 object-cover rounded-lg border border-zinc-200"
                      />
                      <div className="text-left">
                        <p className="text-xs font-semibold text-emerald-600">
                          Cover image uploaded!
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          Click to select a different image
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-2">
                      <UploadCloud size={20} className="text-zinc-400 mb-1" />
                      <span className="text-xs font-semibold text-zinc-700">
                        Click to upload project screenshot
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
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
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
                {editIndex !== undefined ? "Save Project" : "Create Project Box"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
