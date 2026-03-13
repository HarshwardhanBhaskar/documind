import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DocuMind – Intelligent Document Toolkit",
  description: "AI-powered document processing platform. Merge, split, compress, convert, and extract insights from your documents with cutting-edge AI.",
  keywords: "PDF merge, PDF split, OCR, document AI, document processing, PDF tools",
  openGraph: {
    title: "DocuMind – Intelligent Document Toolkit",
    description: "AI-powered document processing platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.className}`}>
      <body className="antialiased" style={{ width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
