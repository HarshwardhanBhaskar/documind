import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Problem from '@/components/Problem';
import Features from '@/components/Features';
import AIPipeline from '@/components/AIPipeline';
import UploadDemo from '@/components/UploadDemo';
import DashboardPreview from '@/components/DashboardPreview';
import TechStack from '@/components/TechStack';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <Navbar />
      <Hero />
      <Problem />
      <Features />
      <AIPipeline />
      <UploadDemo />
      <DashboardPreview />
      <TechStack />
      <CTA />
      <Footer />
    </main>
  );
}
