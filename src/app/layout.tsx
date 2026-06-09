import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StreamBro - Nonton Anime & Film Gratis",
  description: "Streaming anime, film, dan video gratis. Subtitle Indonesia.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "StreamBro",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.className} min-h-screen pb-20 md:pb-0`}>
        <Navbar />
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
          {children}
        </main>
        {/* Footer - hidden on mobile */}
        <footer className="hidden md:block border-t border-white/5 mt-20">
          <div className="container mx-auto px-4 py-8 text-center text-gray-600 text-sm">
            <p>StreamBro &copy; 2024 - Powered by ScriptAPI</p>
            <p className="mt-1">All content is provided by third-party APIs. We do not host any files.</p>
          </div>
        </footer>
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </body>
    </html>
  );
}
