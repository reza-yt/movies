"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

interface FilterSortProps {
  showSort?: boolean;
  sortOptions?: { value: string; label: string }[];
}

const defaultSortOptions = [
  { value: "latest", label: "Terbaru" },
  { value: "popular", label: "Populer" },
  { value: "rating", label: "Rating" },
];

export default function FilterSort({ showSort = true, sortOptions = defaultSortOptions }: FilterSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "latest";

  function handleSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page"); // Reset page on sort change
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <SlidersHorizontal className="w-4 h-4 text-gray-500" />
      <div className="flex gap-1 rounded-lg bg-white/5 border border-white/10 p-0.5">
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSort(opt.value)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              currentSort === opt.value
                ? "bg-red-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
