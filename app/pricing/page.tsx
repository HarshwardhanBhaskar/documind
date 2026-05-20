import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Pricing from '@/components/Pricing';

export const metadata = {
    title: 'Pricing | NeuroDocs',
    description: 'Transparent pricing for teams of all sizes.',
};

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-black text-white w-full overflow-x-hidden relative">
            {/* Global ambient lighting */}
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

            <div className="relative z-10 w-full flex flex-col min-h-screen">
                <Navbar />
                
                <div className="flex-1 pt-12">
                    <Pricing />
                </div>

                <Footer />
            </div>
        </main>
    );
}
