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
    <main className="min-h-screen bg-black text-white w-full overflow-x-hidden relative">
      {/* Global ambient lighting — fixed so it persists while scrolling */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div
          className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute bottom-40 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* All sections stacked above the glow layer */}
      <div className="relative z-10">
        <Navbar />

        {/* ── Hero ── */}
        <Hero />

        {/* ── Problem ── */}
        <Problem />

        {/* ── Features / Tools grid ── */}
        <Features />

        {/* ── AI Pipeline visualization ── */}
        <AIPipeline />

        {/* ── Live upload demo ── */}
        <UploadDemo />

        {/* ── Dashboard product preview ── */}
        <DashboardPreview />

        {/* ── Technology stack strip ── */}
        <TechStack />

        {/* ── Call To Action ── */}
        <CTA />

        <Footer />
      </div>
    </main>
  );
}
