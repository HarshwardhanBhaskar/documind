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
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] w-full overflow-x-hidden transition-colors duration-300">
      <Navbar />
      <AboutCinematicPage />
      <Footer />
    </main>
  );
}
