import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata: Metadata = {
  title: "NexaMOS Web Studio | Visual Landing Page & Web Builder",
  description: "Official visual landing page and web component builder for NexaMOS SaaS Platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-slate-950 text-slate-100">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

