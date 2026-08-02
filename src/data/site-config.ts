// Site-wide configuration — single source of truth for all portfolio data
// Update this file to customize your portfolio content

export const siteConfig = {
  // ─── Identity ───────────────────────────────────────────────
  name: "Nithish",
  fullName: "Nithish S S",
  marqueeText: "Nithish\u00A0\u2014\u00A0S\u00A0S", // Non-breaking spaces around em dash
  title: "Nithish \u2014 S S",
  roles: [
    "Senior Developer",
    "Architect", 
    "UI/UX Developer",
  ],
  year: "2025",

  // ─── Hero Section ──────────────────────────────────────────
  hero: {
    brand: "Nithish",
    footerLeft: [
      "Senior Developer",
      "Architect",
      "UI/UX Developer",
    ],
    footerRight: [
      "A portfolio by",
      "Nithish S S",
    ],
  },

  // ─── Navigation ────────────────────────────────────────────
  nav: {
    siteIndex: [
      { label: "About", href: "#about" },
      { label: "Projects", href: "#projects" },
      { label: "Contact", href: "#contact" },
    ],
    social: [
      { label: "GitHub", href: "https://NITHISH0728.github.io/" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/nithish-s-s-81a0212a5" },
    ],
  },

  // ─── About ─────────────────────────────────────────────────
  about: {
    heading: "About Me",
    bio: [
      "I'm a passionate Senior Developer and Architect with expertise in building scalable, performant web applications.",
      "With a deep understanding of UI/UX principles, I craft digital experiences that are not only functional but visually stunning.",
      "My approach combines clean architecture with cutting-edge design to deliver products that users love.",
    ],
    stats: [
      { label: "Years Experience", value: "5+" },
      { label: "Projects Completed", value: "30+" },
      { label: "Technologies", value: "20+" },
      { label: "Happy Clients", value: "15+" },
    ],
  },

  // ─── Education ─────────────────────────────────────────────
  education: [
    {
      institution: "ST. JOSEPH'S COLLEGE OF ENGINEERING",
      location: "Chennai",
      degree: "B.E / B.Tech — Computer Science & Engineering",
      period: "2024 — 2028",
      score: "Pursuing",
      progress: 100,
    },
    {
      institution: "St. Joseph's Higher Sec School",
      location: "Chengalpattu",
      degree: "HSC — Computer Science Stream (12th)",
      period: "2022 — 2024",
      score: "88.4%",
      progress: 88.4,
    },
    {
      institution: "St. Joseph's Higher Sec School",
      location: "Chengalpattu",
      degree: "SSLC — 10th Grade",
      period: "2010 — 2022",
      score: "92.2%",
      progress: 92.2,
    },
  ],

  // ─── Skills ────────────────────────────────────────────────
  skills: {
    categories: [
      {
        name: "Frontend",
        items: [
          { name: "React", icon: "react" },
          { name: "Next.js", icon: "nextjs" },
          { name: "TypeScript", icon: "typescript" },
          { name: "Tailwind CSS", icon: "tailwind" },
          { name: "Framer Motion", icon: "framer" },
          { name: "Three.js", icon: "threejs" },
        ],
      },
      {
        name: "Backend",
        items: [
          { name: "Node.js", icon: "nodejs" },
          { name: "Express", icon: "express" },
          { name: "Python", icon: "python" },
          { name: "MongoDB", icon: "mongodb" },
          { name: "PostgreSQL", icon: "postgresql" },
          { name: "Firebase", icon: "firebase" },
        ],
      },
      {
        name: "Tools & Design",
        items: [
          { name: "Git", icon: "git" },
          { name: "Docker", icon: "docker" },
          { name: "Figma", icon: "figma" },
          { name: "VS Code", icon: "vscode" },
          { name: "Vercel", icon: "vercel" },
          { name: "AWS", icon: "aws" },
        ],
      },
    ],
  },

  // ─── Certifications ────────────────────────────────────────
  certifications: [
    {
      name: "AWS Solutions Architect",
      institution: "Amazon Web Services",
      date: "2024",
      credentialId: "AWS-SAA-C03",
      logo: "/images/cert-aws.svg",
    },
    {
      name: "Meta Frontend Developer",
      institution: "Meta (Coursera)",
      date: "2023",
      credentialId: "META-FE-2023",
      logo: "/images/cert-meta.png",
    },
    {
      name: "Google UX Design",
      institution: "Google (Coursera)",
      date: "2023",
      credentialId: "GOOGLE-UX-2023",
      logo: "/images/cert-google.svg",
    },
  ],

  // ─── Projects ──────────────────────────────────────────────
  projects: [
    {
      title: "SkillForge LMS",
      description: "A comprehensive Learning Management System with course builder, code arena, and real-time collaboration features.",
      tech: ["React", "Node.js", "MongoDB", "TypeScript"],
      image: "/images/placeholder-project.svg",
      liveUrl: "#",
      githubUrl: "#",
      featured: true,
    },
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with payment integration, admin dashboard, and real-time inventory management.",
      tech: ["Next.js", "Stripe", "PostgreSQL", "Tailwind"],
      image: "/images/placeholder-project.svg",
      liveUrl: "#",
      githubUrl: "#",
      featured: true,
    },
    {
      title: "AI Chat Application",
      description: "Real-time chat application with AI-powered responses, file sharing, and end-to-end encryption.",
      tech: ["React", "OpenAI", "Socket.io", "Express"],
      image: "/images/placeholder-project.svg",
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
    },
    {
      title: "Portfolio Generator",
      description: "Dynamic portfolio generator that creates stunning personal websites from structured data input.",
      tech: ["Next.js", "Three.js", "GSAP", "Framer Motion"],
      image: "/images/placeholder-project.svg",
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
    },
  ],

  // ─── Achievements ──────────────────────────────────────────
  achievements: [
    {
      title: "Hackathon Winner",
      event: "TechFest 2024",
      description: "First place in the national-level hackathon with 500+ participants.",
      type: "trophy" as const,
    },
    {
      title: "Open Source Contributor",
      event: "GitHub",
      description: "500+ contributions to open source projects in 2024.",
      type: "badge" as const,
    },
    {
      title: "Best UI/UX Design",
      event: "DesignCon 2023",
      description: "Award for outstanding user interface design in web applications.",
      type: "award" as const,
    },
    {
      title: "Dean's List",
      event: "University of Technology",
      description: "Consistent academic excellence across all semesters.",
      type: "academic" as const,
    },
  ],

  // ─── Contact / Footer ──────────────────────────────────────
  contact: {
    name: "Nithish S S",
    email: "nithishss48@gmail.com",
    phone: "+91 8608113558",
    address: ["25 Ashmitha Garden", "Chengalpattu 603101."],
    social: [
      {
        platform: "LinkedIn",
        url: "https://www.linkedin.com/in/nithish-s-s-81a0212a5",
        icon: "linkedin",
      },
      {
        platform: "GitHub",
        url: "https://NITHISH0728.github.io/",
        icon: "github",
      },
    ],
  },

  // ─── SEO ───────────────────────────────────────────────────
  seo: {
    title: "Nithish S S — Senior Developer & Architect",
    description: "Portfolio of Nithish S S — Senior Developer, Architect, and UI/UX Developer crafting premium digital experiences.",
    url: "https://nithish.dev",
    ogImage: "/images/og-image.png",
  },
} as const;

export type SiteConfig = typeof siteConfig;
