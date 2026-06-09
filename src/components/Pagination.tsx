import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  hasMore?: boolean;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, hasMore, baseUrl }: PaginationProps) {
  const showPrev = currentPage > 1;
  const showNext = totalPages ? currentPage < totalPages : hasMore;
  const separator = baseUrl.includes("?") ? "&" : "?";

  if (!showPrev && !showNext) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-10">
      {showPrev ? (
        <Link
          href={`${baseUrl}${separator}page=${currentPage - 1}`}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all hover:-translate-x-0.5"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Link>
      ) : (
        <div />
      )}

      <span className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-sm font-medium text-red-400">
        {currentPage} {totalPages ? `/ ${totalPages}` : ""}
      </span>

      {showNext ? (
        <Link
          href={`${baseUrl}${separator}page=${currentPage + 1}`}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all hover:translate-x-0.5"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
