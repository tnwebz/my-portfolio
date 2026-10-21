"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { siteConfig } from "@/data/site-config";
import { certificateCategories, type CertificateCategory } from "@/data/certificates";

export interface SkillItem {
  id?: string;
  name: string;
  glowColor: string;
  iconBg: string;
  iconType?: "preset" | "image";
  presetName?: string;
  iconUrl?: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  description: string;
  src: string;
}

export interface ProjectItem {
  id?: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  problem?: string;
  solution?: string;
}

export interface MetricItem {
  label: string;
  value: number;
  suffix: string;
}

export interface AchievementCardItem {
  emoji: string;
  title: string;
  description: string;
  tag: string;
}

export interface AboutData {
  photo: string;
  name: string;
  role: string;
  heading: string;
  bio: string[];
  stats: { label: string; value: string }[];
}

export interface SkillsData {
  programmingLanguages: SkillItem[];
  webDevFrontend: SkillItem[];
  webDevBackend: SkillItem[];
  webDevDatabase: SkillItem[];
  tools: SkillItem[];
}

interface AdminContextType {
  isAdmin: boolean;
  passkeyModalOpen: boolean;
  setPasskeyModalOpen: (open: boolean) => void;
  verifyPasskey: (key: string) => boolean;
  exitAdmin: () => void;
  enterAdmin: () => void;

  // Data states
  aboutData: AboutData;
  setAboutData: React.Dispatch<React.SetStateAction<AboutData>>;
  updateAbout: (partial: Partial<AboutData>) => void;

  skillsData: SkillsData;
  addSkill: (group: keyof SkillsData, skill: SkillItem) => void;
  updateSkill: (group: keyof SkillsData, index: number, skill: SkillItem) => void;
  deleteSkill: (group: keyof SkillsData, index: number) => void;

  certificationsData: CertificationItem[];
  addCertification: (cert: CertificationItem) => void;
  updateCertification: (index: number, cert: CertificationItem) => void;
  deleteCertification: (index: number) => void;

  categoriesData: CertificateCategory[];
  addCategory: (cat: CertificateCategory) => void;
  updateCategory: (id: string, cat: CertificateCategory) => void;
  deleteCategory: (id: string) => void;

  categoryCertificates: Record<string, string[]>;
  addCategoryCertificate: (categoryId: string, imageUrl: string) => void;
  deleteCategoryCertificate: (categoryId: string, index: number) => void;

  projectsData: ProjectItem[];
  addProject: (project: ProjectItem) => void;
  updateProject: (index: number, project: ProjectItem) => void;
  deleteProject: (index: number) => void;

  statMetrics: MetricItem[];
  updateStatMetric: (index: number, metric: MetricItem) => void;
  achievementCards: AchievementCardItem[];
  updateAchievementCard: (index: number, card: AchievementCardItem) => void;
  addAchievementCard: (card: AchievementCardItem) => void;
  deleteAchievementCard: (index: number) => void;

  // Persistence
  saveAll: () => Promise<boolean>;
  resetToDefaults: () => void;
  isSaving: boolean;
  lastSavedAt: string | null;
}

const DEFAULT_ABOUT: AboutData = {
  photo: "/images/Nithish3.png",
  name: siteConfig.fullName,
  role: "Senior Developer & Architect",
  heading: "Architecting scalable systems with an obsessive eye for visual precision.",
  bio: [
    "I'm a passionate Senior Developer and Architect with expertise in building scalable, performant web applications.",
    "With a deep understanding of UI/UX principles, I craft digital experiences that are not only functional but visually stunning.",
    "My approach combines clean architecture with cutting-edge design to deliver products that users love.",
  ],
  stats: [
    { label: "Years Experience", value: "2" },
    { label: "Freelance Projects", value: "10+" },
    { label: "Certification", value: "30+" },
    { label: "Real Clients", value: "10+" },
  ],
};

const DEFAULT_SKILLS: SkillsData = {
  programmingLanguages: [
    { name: "Java", glowColor: "rgba(59, 130, 246, 0.22)", iconBg: "from-blue-50/80 to-blue-100/40", presetName: "Java", iconType: "preset" },
    { name: "JavaScript", glowColor: "rgba(234, 179, 8, 0.25)", iconBg: "from-amber-50/80 to-yellow-100/40", presetName: "JavaScript", iconType: "preset" },
    { name: "C", glowColor: "rgba(239, 68, 68, 0.22)", iconBg: "from-red-50/80 to-orange-100/40", presetName: "C", iconType: "preset" },
  ],
  webDevFrontend: [
    { name: "HTML", glowColor: "rgba(249, 115, 22, 0.22)", iconBg: "from-orange-50/80 to-red-100/40", presetName: "HTML", iconType: "preset" },
    { name: "CSS", glowColor: "rgba(37, 99, 235, 0.22)", iconBg: "from-blue-50/80 to-sky-100/40", presetName: "CSS", iconType: "preset" },
    { name: "React", glowColor: "rgba(6, 182, 212, 0.25)", iconBg: "from-cyan-50/80 to-teal-100/40", presetName: "React", iconType: "preset" },
    { name: "Tailwind CSS", glowColor: "rgba(20, 184, 166, 0.22)", iconBg: "from-teal-50/80 to-emerald-100/40", presetName: "Tailwind", iconType: "preset" },
  ],
  webDevBackend: [
    { name: "Node.js", glowColor: "rgba(34, 197, 94, 0.22)", iconBg: "from-green-50/80 to-emerald-100/40", presetName: "NodeJS", iconType: "preset" },
    { name: "Express.js", glowColor: "rgba(113, 113, 122, 0.22)", iconBg: "from-zinc-100/80 to-zinc-200/40", presetName: "ExpressJS", iconType: "preset" },
    { name: "Python", glowColor: "rgba(234, 179, 8, 0.22)", iconBg: "from-yellow-50/80 to-amber-100/40", presetName: "Python", iconType: "preset" },
  ],
  webDevDatabase: [
    { name: "MySQL", glowColor: "rgba(2, 132, 199, 0.22)", iconBg: "from-sky-50/80 to-blue-100/40", presetName: "MySQL", iconType: "preset" },
    { name: "MongoDB", glowColor: "rgba(16, 185, 129, 0.22)", iconBg: "from-emerald-50/80 to-green-100/40", presetName: "MongoDB", iconType: "preset" },
    { name: "PostgreSQL", glowColor: "rgba(99, 102, 241, 0.22)", iconBg: "from-indigo-50/80 to-blue-100/40", presetName: "PostgreSQL", iconType: "preset" },
  ],
  tools: [
    { name: "Claude", glowColor: "rgba(218, 119, 86, 0.22)", iconBg: "from-orange-50/80 to-red-100/40", presetName: "Claude", iconType: "preset" },
    { name: "Cursor", glowColor: "rgba(0, 0, 0, 0.22)", iconBg: "from-zinc-100/80 to-zinc-200/40", presetName: "Cursor", iconType: "preset" },
    { name: "Antigravity", glowColor: "rgba(16, 185, 129, 0.22)", iconBg: "from-emerald-50/80 to-cyan-100/40", presetName: "Antigravity", iconType: "preset" },
    { name: "n8n", glowColor: "rgba(234, 75, 113, 0.22)", iconBg: "from-rose-50/80 to-pink-100/40", presetName: "n8n", iconType: "preset" },
    { name: "GitHub", glowColor: "rgba(0, 0, 0, 0.22)", iconBg: "from-zinc-100/80 to-zinc-200/40", presetName: "GitHub", iconType: "preset" },
    { name: "VS Code", glowColor: "rgba(59, 130, 246, 0.22)", iconBg: "from-blue-50/80 to-indigo-100/40", presetName: "VSCode", iconType: "preset" },
  ],
};

const DEFAULT_CERTIFICATIONS: CertificationItem[] = siteConfig.certifications.map((cert) => ({
  id: cert.credentialId,
  title: cert.name,
  issuer: cert.institution,
  date: cert.date,
  credentialId: cert.credentialId,
  description: `Verified credential ${cert.credentialId}. Issued by ${cert.institution} in ${cert.date}. Demonstrating expertise in cloud architecture, full-stack development, and modern web technologies.`,
  src: cert.logo,
}));

const DEFAULT_PROJECTS: ProjectItem[] = siteConfig.projects.map((p) => ({
  title: p.title,
  description: p.description,
  tech: [...p.tech],
  image: p.image,
  liveUrl: p.liveUrl,
  githubUrl: p.githubUrl,
  featured: p.featured,
  problem:
    "Outdated platforms lacked intuitive course building, real-time coding environments, and effective collaboration tools.",
  solution:
    "Developed a modern LMS using React and Node.js, integrating a robust code arena and real-time sockets.",
}));

const DEFAULT_STAT_METRICS: MetricItem[] = [
  { label: "HACKATHON WINS", value: 5, suffix: "" },
  { label: "CERTIFICATIONS", value: 30, suffix: "+" },
  { label: "INTERNSHIPS", value: 2, suffix: "" },
  { label: "FREELANCE PROJECTS", value: 10, suffix: "+" },
];

const DEFAULT_ACHIEVEMENT_CARDS: AchievementCardItem[] = [
  {
    emoji: "🏆",
    title: "Hackathon Winner",
    description: "First place in the national-level hackathon with 30+ participants.",
    tag: "NEURATHON 2026",
  },
  {
    emoji: "🔥",
    title: "High Value Certifications",
    description: "Meta certified full stack web development bootcamp ,Mongo DB Course",
    tag: "GITHUB",
  },
  {
    emoji: "🏅",
    title: "Stipend Internship",
    description: "Award of ₹10000 in a Reputed Companies",
    tag: "IQmath & Enlight Wisdom",
  },
  {
    emoji: "🎖️",
    title: "Freelancing",
    description: "Worked on10+ Real Time Projects",
    tag: "TNWebz",
  },
];

const LOCAL_STORAGE_KEY = "portfolio_admin_custom_data_v1";
const ADMIN_SESSION_KEY = "portfolio_admin_active_session";

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [passkeyModalOpen, setPasskeyModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // Core Data Stores
  const [aboutData, setAboutData] = useState<AboutData>(DEFAULT_ABOUT);
  const [skillsData, setSkillsData] = useState<SkillsData>(DEFAULT_SKILLS);
  const [certificationsData, setCertificationsData] = useState<CertificationItem[]>(DEFAULT_CERTIFICATIONS);
  const [categoriesData, setCategoriesData] = useState<CertificateCategory[]>(certificateCategories);
  const [categoryCertificates, setCategoryCertificates] = useState<Record<string, string[]>>({});
  const [projectsData, setProjectsData] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [statMetrics, setStatMetrics] = useState<MetricItem[]>(DEFAULT_STAT_METRICS);
  const [achievementCards, setAchievementCards] = useState<AchievementCardItem[]>(DEFAULT_ACHIEVEMENT_CARDS);

  // 1. Initial Load: Load Admin Session & Data from API or LocalStorage
  useEffect(() => {
    // Check if admin was active
    try {
      const savedAdmin = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (savedAdmin === "true") {
        setIsAdmin(true);
      }
    } catch {}

    // Load custom data from server or localStorage
    const loadData = async () => {
      try {
        const res = await fetch("/api/portfolio-data");
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            applyLoadedData(json.data);
            return;
          }
        }
      } catch (e) {
        console.warn("Could not load from API, falling back to localStorage", e);
      }

      try {
        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          applyLoadedData(parsed);
        }
      } catch (e) {
        console.error("Failed to load local data", e);
      }
    };

    loadData();
  }, []);

  const applyLoadedData = (data: any) => {
    if (data.about) setAboutData(data.about);
    if (data.skills) setSkillsData(data.skills);
    if (data.certifications) setCertificationsData(data.certifications);
    if (data.categories) setCategoriesData(data.categories);
    if (data.categoryCertificates) setCategoryCertificates(data.categoryCertificates);
    if (data.projects) setProjectsData(data.projects);
    if (data.statMetrics) setStatMetrics(data.statMetrics);
    if (data.achievementCards) setAchievementCards(data.achievementCards);
  };

  // Passkey verification (Key: 0728)
  const verifyPasskey = useCallback((key: string): boolean => {
    if (key.trim() === "0728") {
      setIsAdmin(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      setPasskeyModalOpen(false);
      return true;
    }
    return false;
  }, []);

  const enterAdmin = useCallback(() => {
    setIsAdmin(true);
    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
  }, []);

  const exitAdmin = useCallback(() => {
    setIsAdmin(false);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }, []);

  // Update about helper
  const updateAbout = (partial: Partial<AboutData>) => {
    setAboutData((prev) => ({ ...prev, ...partial }));
  };

  // Skill actions
  const addSkill = (group: keyof SkillsData, skill: SkillItem) => {
    setSkillsData((prev) => ({
      ...prev,
      [group]: [...prev[group], skill],
    }));
  };

  const updateSkill = (group: keyof SkillsData, index: number, skill: SkillItem) => {
    setSkillsData((prev) => {
      const list = [...prev[group]];
      list[index] = skill;
      return { ...prev, [group]: list };
    });
  };

  const deleteSkill = (group: keyof SkillsData, index: number) => {
    setSkillsData((prev) => {
      const list = prev[group].filter((_, i) => i !== index);
      return { ...prev, [group]: list };
    });
  };

  // Certifications actions
  const addCertification = (cert: CertificationItem) => {
    setCertificationsData((prev) => [...prev, cert]);
  };

  const updateCertification = (index: number, cert: CertificationItem) => {
    setCertificationsData((prev) => {
      const list = [...prev];
      list[index] = cert;
      return { ...prev, [index]: cert };
    });
  };

  const deleteCertification = (index: number) => {
    setCertificationsData((prev) => prev.filter((_, i) => i !== index));
  };

  // Categories actions
  const addCategory = (cat: CertificateCategory) => {
    setCategoriesData((prev) => [...prev, cat]);
  };

  const updateCategory = (id: string, updated: CertificateCategory) => {
    setCategoriesData((prev) =>
      prev.map((c) => (c.id === id ? updated : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategoriesData((prev) => prev.filter((c) => c.id !== id));
  };

  const addCategoryCertificate = (categoryId: string, imageUrl: string) => {
    setCategoryCertificates((prev) => ({
      ...prev,
      [categoryId]: [...(prev[categoryId] || []), imageUrl],
    }));
  };

  const deleteCategoryCertificate = (categoryId: string, index: number) => {
    setCategoryCertificates((prev) => {
      const list = (prev[categoryId] || []).filter((_, i) => i !== index);
      return { ...prev, [categoryId]: list };
    });
  };

  // Projects actions
  const addProject = (project: ProjectItem) => {
    setProjectsData((prev) => [project, ...prev]);
  };

  const updateProject = (index: number, project: ProjectItem) => {
    setProjectsData((prev) => {
      const list = [...prev];
      list[index] = project;
      return list;
    });
  };

  const deleteProject = (index: number) => {
    setProjectsData((prev) => prev.filter((_, i) => i !== index));
  };

  // Achievements actions
  const updateStatMetric = (index: number, metric: MetricItem) => {
    setStatMetrics((prev) => {
      const list = [...prev];
      list[index] = metric;
      return list;
    });
  };

  const updateAchievementCard = (index: number, card: AchievementCardItem) => {
    setAchievementCards((prev) => {
      const list = [...prev];
      list[index] = card;
      return list;
    });
  };

  const addAchievementCard = (card: AchievementCardItem) => {
    setAchievementCards((prev) => [...prev, card]);
  };

  const deleteAchievementCard = (index: number) => {
    setAchievementCards((prev) => prev.filter((_, i) => i !== index));
  };

  // Master Save Function
  const saveAll = async (): Promise<boolean> => {
    setIsSaving(true);
    const payload = {
      about: aboutData,
      skills: skillsData,
      certifications: certificationsData,
      categories: categoriesData,
      categoryCertificates: categoryCertificates,
      projects: projectsData,
      statMetrics: statMetrics,
      achievementCards: achievementCards,
      updatedAt: new Date().toISOString(),
    };

    // Save to localStorage
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error("Local storage error:", e);
    }

    // Save to Server JSON
    try {
      const res = await fetch("/api/portfolio-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setIsSaving(false);
      setLastSavedAt(new Date().toLocaleTimeString());
      return res.ok;
    } catch (err) {
      console.error("Save to API failed:", err);
      setIsSaving(false);
      setLastSavedAt(new Date().toLocaleTimeString());
      return true; // LocalStorage still succeeded
    }
  };

  // Reset to default
  const resetToDefaults = () => {
    if (confirm("Reset all portfolio customizations to their original defaults?")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setAboutData(DEFAULT_ABOUT);
      setSkillsData(DEFAULT_SKILLS);
      setCertificationsData(DEFAULT_CERTIFICATIONS);
      setCategoriesData(certificateCategories);
      setCategoryCertificates({});
      setProjectsData(DEFAULT_PROJECTS);
      setStatMetrics(DEFAULT_STAT_METRICS);
      setAchievementCards(DEFAULT_ACHIEVEMENT_CARDS);
      saveAll();
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        passkeyModalOpen,
        setPasskeyModalOpen,
        verifyPasskey,
        exitAdmin,
        enterAdmin,
        aboutData,
        setAboutData,
        updateAbout,
        skillsData,
        addSkill,
        updateSkill,
        deleteSkill,
        certificationsData,
        addCertification,
        updateCertification,
        deleteCertification,
        categoriesData,
        addCategory,
        updateCategory,
        deleteCategory,
        categoryCertificates,
        addCategoryCertificate,
        deleteCategoryCertificate,
        projectsData,
        addProject,
        updateProject,
        deleteProject,
        statMetrics,
        updateStatMetric,
        achievementCards,
        updateAchievementCard,
        addAchievementCard,
        deleteAchievementCard,
        saveAll,
        resetToDefaults,
        isSaving,
        lastSavedAt,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
