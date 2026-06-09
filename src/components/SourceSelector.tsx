"use client";

import Link from "next/link";
import { sources, sourceCategories, getSourcesByCategory } from "@/lib/sources";

interface SourceSelectorProps {
  activeSource?: string;
}

export default function SourceSelector({ activeSource }: SourceSelectorProps) {
  return (
    <div className="space-y-4">
      {sourceCategories.map((category) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
            {category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {getSourcesByCategory(category).map((source) => (
              <Link
                key={source.id}
                href={`/source/${source.slug}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  activeSource === source.id
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {source.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
