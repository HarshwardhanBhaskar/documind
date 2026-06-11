import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutCinematicPage from '@/components/about/AboutCinematicPage';

export const metadata: Metadata = {
  title: 'About | NeuroDocs',
  description: 'Cinematic product story of NeuroDocs and the long-term vision of AI document intelligence.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] w-full overflow-x-hidden relative transition-colors duration-300">
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
      <div className="relative z-10 w-full flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1">
          <AboutCinematicPage />
        </div>
        <Footer />
      </div>
    </main>
  );
}
