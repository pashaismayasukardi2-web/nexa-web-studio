import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata: Metadata = {
  title: "NexaMOS Web Studio | Visual Landing Page & Web Builder",
  description: "Official visual landing page and web component builder for NexaMOS SaaS Platform.",
  icons: {
    icon: [
      { url: "/icon.png?v=4", type: "image/png", sizes: "512x512" },
      { url: "/favicon-32x32.png?v=4", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png?v=4", type: "image/png", sizes: "16x16" },
      { url: "/favicon.svg?v=4", type: "image/svg+xml" },
      { url: "/favicon.ico?v=4", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=4", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=4",
  },
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

