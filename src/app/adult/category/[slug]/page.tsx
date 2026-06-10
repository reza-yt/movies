import { getAdultVideosByCategory } from "@/lib/api";
import VideoCard from "@/components/VideoCard";
import Pagination from "@/components/Pagination";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function AdultCategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const videos = await getAdultVideosByCategory(slug, currentPage);
  const videoList = videos || [];
  const categoryName = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="space-y-8">
      <div>
        <Link href="/adult" className="text-red-400 hover:text-red-300 text-sm mb-2 inline-block">
          ← Kembali ke 18+
        </Link>
        <h1 className="text-3xl font-bold">{categoryName}</h1>
        <p className="text-gray-500 mt-1">Kategori: {categoryName}</p>
      </div>

      {videoList.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 stagger-children">
          {videoList.map((video) => (
            <VideoCard
              key={video.slug}
              title={video.title}
              thumbnail={video.thumbnail}
              slug={video.slug}
              href={`/watch/adult/${video.slug}`}
              duration={video.duration}
              badge="18+"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">Tidak ada video</div>
      )}

      <Pagination currentPage={currentPage} hasMore={videoList.length > 0} baseUrl={`/adult/category/${slug}`} />
    </div>
  );
}
