import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

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

  // Generate page numbers to show
  const pages: number[] = [];
  if (totalPages) {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 mt-10">
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {/* First Page */}
        {totalPages && currentPage > 3 && (
          <Link
            href={`${baseUrl}${separator}page=1`}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-400 hover:text-white transition"
            title="Halaman pertama"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Link>
        )}

        {/* Prev */}
        {showPrev && (
          <Link
            href={`${baseUrl}${separator}page=${currentPage - 1}`}
            className="h-9 px-3 flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium text-gray-300 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </Link>
        )}

        {/* Page Numbers (only if totalPages known) */}
        {totalPages && pages.length > 0 && (
          <>
            {pages[0] > 1 && (
              <span className="text-gray-600 text-sm px-1">...</span>
            )}
            {pages.map((p) => (
              <Link
                key={p}
                href={`${baseUrl}${separator}page=${p}`}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                  p === currentPage
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {p}
              </Link>
            ))}
            {pages[pages.length - 1] < totalPages && (
              <span className="text-gray-600 text-sm px-1">...</span>
            )}
          </>
        )}

        {/* Current page indicator (when no totalPages) */}
        {!totalPages && (
          <span className="h-9 px-4 flex items-center rounded-lg bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400">
            Halaman {currentPage}
          </span>
        )}

        {/* Next */}
        {showNext && (
          <Link
            href={`${baseUrl}${separator}page=${currentPage + 1}`}
            className="h-9 px-3 flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium text-gray-300 hover:text-white transition"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}

        {/* Last Page */}
        {totalPages && currentPage < totalPages - 2 && (
          <Link
            href={`${baseUrl}${separator}page=${totalPages}`}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-400 hover:text-white transition"
            title="Halaman terakhir"
          >
            <ChevronsRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Total info */}
      {totalPages && (
        <p className="text-xs text-gray-600">
          Halaman {currentPage} dari {totalPages}
        </p>
      )}
    </div>
  );
}
