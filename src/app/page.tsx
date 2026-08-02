import {
  HeroSection,
  AboutSection,
  EducationSection,
  CertificationsSection,
  ProjectsSection,
  AchievementsSection,
} from "@/components/sections";
import SiteFooter from "@/components/ui/site-footer";

export default function Home() {
  return (
    <main id="top" className="relative min-h-dvh w-full overflow-x-clip">
      <HeroSection />
      <AboutSection />
      <EducationSection />
      <CertificationsSection />
      <ProjectsSection />
      <AchievementsSection />
      <SiteFooter />
    </main>
  );
}
