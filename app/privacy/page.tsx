import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Privacy Policy | NeuroDocs',
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-black text-white w-full overflow-x-hidden relative">
            <Navbar />
            
            <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto min-h-[80vh]">
                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-slate-400">Last updated: March 14, 2024</p>
                </div>
                
                <div className="prose prose-invert prose-indigo max-w-none">
                    <p className="text-slate-300 leading-relaxed max-w-2xl mb-8">
                        At NeuroDocs, we take your privacy seriously. This privacy policy explains how we collect, use, and protect your personal information and documents when you use our AI document intelligence platform.
                    </p>
                    
                    <h2 className="text-2xl font-semibold mt-12 mb-4 text-white">1. Information We Collect</h2>
                    <p className="text-slate-400 mb-4">
                        We collect information you provide directly to us when you create an account, such as your name, email address, and authentication credentials via Supabase.
                    </p>
                    
                    <h2 className="text-2xl font-semibold mt-12 mb-4 text-white">2. Document Privacy</h2>
                    <p className="text-slate-400 mb-4">
                        Documents uploaded to NeuroDocs are stored securely in Supabase Storage with Row Level Security (RLS) enabled. This means only you can access the documents you upload. We do not use your private documents to train our core AI models.
                    </p>

                    <h2 className="text-2xl font-semibold mt-12 mb-4 text-white">3. Data Retention</h2>
                    <p className="text-slate-400 mb-4">
                        You can manually delete your documents at any time from your dashboard. When a document is deleted, all associated metadata and extracted AI fields are permanently removed from our databases.
                    </p>
                    
                    <h2 className="text-2xl font-semibold mt-12 mb-4 text-white">4. Contact Us</h2>
                    <p className="text-slate-400 mb-4">
                        If you have any questions about this Privacy Policy, please contact us or open an issue on our GitHub repository.
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    );
}
