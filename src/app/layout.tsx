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
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-bold text-white mb-3">StreamBro</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Nonton anime, drama, dan video gratis. Semua konten disediakan oleh API pihak ketiga.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-3">Navigasi</h3>
                <div className="space-y-2 text-xs">
                  <a href="/anime" className="block text-gray-500 hover:text-white transition">Anime</a>
                  <a href="/drama" className="block text-gray-500 hover:text-white transition">Drama</a>
                  <a href="/adult" className="block text-gray-500 hover:text-white transition">18+</a>
                  <a href="/subscribe" className="block text-gray-500 hover:text-white transition">Premium</a>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-3">Legal</h3>
                <div className="space-y-2 text-xs">
                  <a href="/terms" className="block text-gray-500 hover:text-white transition">Terms of Service</a>
                  <a href="/privacy" className="block text-gray-500 hover:text-white transition">Privacy Policy</a>
                  <a href="/dmca" className="block text-gray-500 hover:text-white transition">DMCA</a>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5 text-center text-xs text-gray-600">
              <p>StreamBro &copy; 2024 - All content is provided by third-party APIs. We do not host any files.</p>
            </div>
          </div>
        </footer>
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </body>
    </html>
  );
}
