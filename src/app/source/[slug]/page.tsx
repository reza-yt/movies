import { getLatestVideos, getCategories } from "@/lib/api";
import VideoGrid from "@/components/VideoGrid";
import { getSourceById, sources } from "@/lib/sources";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  return sources.map((source) => ({
    slug: source.slug,
  }));
}

export default async function SourcePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const source = getSourceById(slug);

  if (!source) {
    notFound();
  }

  const currentPage = parseInt(page || "1");
  const [videosData, categoriesData] = await Promise.all([
    getLatestVideos(source.id, currentPage),
    getCategories(source.id),
  ]);

  const videos = Array.isArray(videosData?.data) ? videosData.data : [];
  const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{source.name}</h1>
        <p className="text-gray-400 mt-1">Category: {source.category}</p>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id || cat.slug}
                href={`/source/${slug}/category/${cat.slug}`}
                className="px-3 py-1.5 bg-gray-800 text-gray-300 hover:bg-red-600 hover:text-white rounded-full text-sm transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      <VideoGrid videos={videos} source={source.id} />

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        {currentPage > 1 && (
          <Link
            href={`/source/${slug}?page=${currentPage - 1}`}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition"
          >
            ← Previous
          </Link>
        )}
        <span className="px-4 py-2 text-gray-400 text-sm">Page {currentPage}</span>
        {videos.length >= 10 && (
          <Link
            href={`/source/${slug}?page=${currentPage + 1}`}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
