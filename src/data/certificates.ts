// Certificate category metadata — single source of truth
// Images are loaded dynamically from public/images/<folder>/

export interface CertificateCategory {
  id: string;
  label: string;
  organization: string;
  year: string;
  description: string;
  folder: string; // Actual folder name inside public/images/
  accentColor: string;
  icon: string; // Emoji or short label for chip/badge
}

export const certificateCategories: CertificateCategory[] = [
  {
    id: "meta",
    label: "Meta",
    organization: "Meta (Coursera)",
    year: "2023–2024",
    description:
      "Professional certifications from Meta covering frontend development, React architecture, and modern web engineering best practices.",
    folder: "meta",
    accentColor: "#2563eb",
    icon: "M",
  },
  {
    id: "internships",
    label: "Internships",
    organization: "Various Organizations",
    year: "2023–2024",
    description:
      "Internship completion certificates demonstrating hands-on industry experience across software development and engineering roles.",
    folder: "internship",
    accentColor: "#059669",
    icon: "I",
  },
  {
    id: "infosys-springboard",
    label: "Infosys Springboard",
    organization: "Infosys Springboard",
    year: "2024",
    description:
      "Skill development certifications from the Infosys Springboard platform, covering cloud computing, data structures, and emerging technologies.",
    folder: "infosys springboard",
    accentColor: "#0891b2",
    icon: "IS",
  },
  {
    id: "cisco",
    label: "Cisco",
    organization: "Cisco Networking Academy",
    year: "2024",
    description:
      "Networking and cybersecurity certifications from Cisco, validating expertise in network infrastructure and security fundamentals.",
    folder: "cisco",
    accentColor: "#d97706",
    icon: "C",
  },
  {
    id: "hackathons",
    label: "Hackathons",
    organization: "Various Events",
    year: "2023–2024",
    description:
      "Hackathon participation and achievement certificates showcasing competitive problem-solving and rapid prototyping skills.",
    folder: "Hackk a thon",
    accentColor: "#7e22ce",
    icon: "H",
  },
];

// Helper to get a category by its id
export function getCategoryById(
  id: string
): CertificateCategory | undefined {
  return certificateCategories.find((c) => c.id === id);
}
