import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutCinematicPage from '@/components/about/AboutCinematicPage';

export const metadata: Metadata = {
  title: 'About | DocuMind',
  description: 'Cinematic product story of DocuMind and the long-term vision of AI document intelligence.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white w-full overflow-x-hidden">
      <Navbar />
      <AboutCinematicPage />
      <Footer />
    </main>
  );
}
