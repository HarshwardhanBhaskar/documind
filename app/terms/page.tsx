import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Terms of Service | NeuroDocs',
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-black text-white w-full overflow-x-hidden relative">
            <Navbar />
            
            <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto min-h-[80vh]">
                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
                    <p className="text-slate-400">Last updated: March 14, 2024</p>
                </div>
                
                <div className="prose prose-invert prose-indigo max-w-none">
                    <p className="text-slate-300 leading-relaxed max-w-2xl mb-8">
                        Please read these terms of service carefully before using NeuroDocs. By using our services, you agree to be bound by these terms.
                    </p>
                    
                    <h2 className="text-2xl font-semibold mt-12 mb-4 text-white">1. Service Description</h2>
                    <p className="text-slate-400 mb-4">
                        NeuroDocs provides AI-powered document intelligence tools, including OCR text extraction, zero-shot classification, and structured data extraction. The services are provided &quot;as is&quot; for demonstration and processing purposes.
                    </p>
                    
                    <h2 className="text-2xl font-semibold mt-12 mb-4 text-white">2. User Responsibilities</h2>
                    <p className="text-slate-400 mb-4">
                        You are responsible for the documents you upload to NeuroDocs. Do not upload illegal content or documents containing highly sensitive protected health information (PHI) or state secrets, as this is a demonstration SaaS environment.
                    </p>

                    <h2 className="text-2xl font-semibold mt-12 mb-4 text-white">3. API Usage Limits</h2>
                    <p className="text-slate-400 mb-4">
                        Users on the Free tier are subject to rate limiting and monthly document processing caps. Attempting to bypass these limits via automated scraping or multiple accounts is a violation of these terms.
                    </p>
                    
                    <h2 className="text-2xl font-semibold mt-12 mb-4 text-white">4. Changes to Terms</h2>
                    <p className="text-slate-400 mb-4">
                        We reserve the right to modify these terms at any time. We will provide notice of significant changes by updating the date at the top of this page.
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    );
}
