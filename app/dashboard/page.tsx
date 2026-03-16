'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle2, AlertCircle, File, LogOut, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { documentsApi, DocumentSummary } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DashboardPage() {
    const router = useRouter();
    const { isAuth, token, loading: authLoading, logout } = useAuth();
    
    const [documents, setDocuments] = useState<DocumentSummary[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Auth Guard
    useEffect(() => {
        if (!authLoading && !isAuth) {
            router.replace('/?login=true');
        }
    }, [isAuth, authLoading, router]);

    // Fetch documents
    useEffect(() => {
        let mounted = true;
        
        async function loadDocs() {
            if (!token) return;
            try {
                setLoadingDocs(true);
                const res = await documentsApi.list(token, 1, 50);
                if (mounted) setDocuments(res.items);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to load documents';
                if (mounted) setError(message);
            } finally {
                if (mounted) setLoadingDocs(false);
            }
        }

        if (token) loadDocs();

        return () => { mounted = false; };
    }, [token]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <span className="badge-green"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</span>;
            case 'failed': return <span className="badge-red"><AlertCircle className="w-3 h-3 mr-1" /> Failed</span>;
            case 'processing': return <span className="badge-yellow"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Processing</span>;
            default: return <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold flex items-center w-fit"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
        }
    };

    if (authLoading || !isAuth) {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </main>
        );
    }

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

                <div className="flex-1 pt-32 pb-20 px-6 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">My Documents</h1>
                        <p className="text-slate-400">Manage your processed files and extracted data.</p>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium text-slate-300"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>

                {error && (
                    <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {loadingDocs ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
                        <p className="text-slate-400">Loading your documents...</p>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
                        <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 flex items-center justify-center mb-6">
                            <File className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">No documents yet</h3>
                        <p className="text-slate-400 mb-8 max-w-sm mx-auto">Upload a document from the home page tools to see the AI extractions here.</p>
                        <button 
                            onClick={() => router.push('/#tools')}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/25"
                        >
                            Go to Tools
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {documents.map((doc, i) => (
                            <motion.div 
                                key={doc.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-indigo-500/50 hover:bg-white/10 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                        <FileText className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs md:max-w-sm mb-1" title={doc.filename}>
                                            {doc.filename}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs text-slate-400">
                                            <span className="uppercase tracking-wider">{doc.file_type || 'Unknown'}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                            <span>{new Date(doc.upload_time).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between w-full md:w-auto gap-6 ml-16 md:ml-0">
                                    {getStatusBadge(doc.processing_status)}
                                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors group-hover:translate-x-1" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
                </div>

                <Footer />
            </div>
        </main>
    );
}
