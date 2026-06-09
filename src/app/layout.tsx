import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StreamFlix - Nonton Anime & Film Gratis",
  description: "Streaming anime, film, dan video gratis. Subtitle Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.className} min-h-screen`}>
        <Navbar />
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {children}
        </main>
        {/* Footer */}
        <footer className="border-t border-white/5 mt-20">
          <div className="container mx-auto px-4 py-8 text-center text-gray-600 text-sm">
            <p>StreamFlix &copy; 2024 - Powered by ScriptAPI</p>
            <p className="mt-1">All content is provided by third-party APIs. We do not host any files.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
