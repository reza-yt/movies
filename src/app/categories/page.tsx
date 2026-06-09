import Link from "next/link";
import { sources, sourceCategories, getSourcesByCategory } from "@/lib/sources";
import { Film, Tv, PlayCircle, BookOpen, Flame } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  Movie: <Film className="w-8 h-8" />,
  Drama: <Tv className="w-8 h-8" />,
  "K-Drama": <Tv className="w-8 h-8" />,
  Short: <PlayCircle className="w-8 h-8" />,
  Anime: <Flame className="w-8 h-8" />,
  Manga: <BookOpen className="w-8 h-8" />,
  Adult: <Flame className="w-8 h-8" />,
};

export const metadata = {
  title: "Categories - StreamFlix",
};

export default function CategoriesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <p className="text-gray-400 mb-8">Browse videos by category type</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sourceCategories.map((category) => {
          const categorySources = getSourcesByCategory(category);
          return (
            <div
              key={category}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-red-500/50 transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-red-500">
                  {categoryIcons[category] || <Film className="w-8 h-8" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{category}</h2>
                  <p className="text-sm text-gray-400">{categorySources.length} sources</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {categorySources.slice(0, 6).map((source) => (
                  <Link
                    key={source.id}
                    href={`/source/${source.slug}`}
                    className="px-2.5 py-1 bg-gray-800 text-gray-300 hover:bg-red-600 hover:text-white rounded text-xs transition"
                  >
                    {source.name}
                  </Link>
                ))}
                {categorySources.length > 6 && (
                  <span className="px-2.5 py-1 text-gray-500 text-xs">
                    +{categorySources.length - 6} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
