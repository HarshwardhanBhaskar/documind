import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "NeuroDocs – Intelligent Document Toolkit",
  description: "AI-powered document processing platform. Merge, split, compress, convert, and extract insights from your documents with cutting-edge AI.",
  keywords: "PDF merge, PDF split, OCR, document AI, document processing, PDF tools",
  openGraph: {
    title: "NeuroDocs – Intelligent Document Toolkit",
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
    <html lang="en" className="light">
      <body className="antialiased" style={{ width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
