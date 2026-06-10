"use client";

import { useState } from "react";
import { Download, Check, ExternalLink } from "lucide-react";

interface DownloadButtonProps {
  url: string;
  title: string;
  quality?: string;
}

export default function DownloadButton({ url, title, quality }: DownloadButtonProps) {
  const [clicked, setClicked] = useState(false);

  function handleDownload() {
    setClicked(true);
    // Open in new tab (video URLs are usually direct m3u8 or mp4)
    window.open(url, "_blank");
    setTimeout(() => setClicked(false), 2000);
  }

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-xl text-sm font-medium transition-all active:scale-95"
    >
      {clicked ? (
        <>
          <Check className="w-4 h-4" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download {quality || "Video"}
        </>
      )}
    </button>
  );
}

interface DownloadLinksProps {
  links: { label: string; url: string }[];
  title: string;
}

export function DownloadLinks({ links, title }: DownloadLinksProps) {
  if (!links || links.length === 0) return null;

  return (
    <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
      <h3 className="text-sm font-bold text-green-400 flex items-center gap-2 mb-3">
        <Download className="w-4 h-4" />
        Download Video
      </h3>
      <div className="flex flex-wrap gap-2">
        {links.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-300 border border-green-500/20 rounded-lg text-xs font-medium transition-all active:scale-95"
          >
            <ExternalLink className="w-3 h-3" />
            {link.label}
          </a>
        ))}
      </div>
      <p className="text-[10px] text-gray-600 mt-2">
        Tip: Klik kanan video → &quot;Save video as&quot; untuk download langsung
      </p>
    </div>
  );
}
