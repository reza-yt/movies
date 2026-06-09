import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkText?: string;
}

export default function SectionHeader({ title, subtitle, href, linkText = "Lihat Semua" }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 font-medium transition group"
        >
          {linkText}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}
