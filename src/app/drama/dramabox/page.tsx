import { getDramaBoxHome } from "@/lib/api";
import VideoCard from "@/components/VideoCard";
import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import { Film } from "lucide-react";

export const metadata = {
  title: "DramaBox - StreamBro",
};

export default async function DramaBoxPage() {
  const sections = await getDramaBoxHome();

  return (
    <div className="space-y-10">
      <div>
        <Link href="/drama" className="text-red-400 hover:text-red-300 text-sm mb-2 inline-block">
          ← Kembali ke Drama
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <Film className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />
          DramaBox
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Short drama HD dengan subtitle</p>
      </div>

      {sections && sections.length > 0 ? (
        sections.slice(0, 5).map((section) => (
          <section key={section.id}>
            <SectionHeader title={section.title} />
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 stagger-children">
              {section.books.slice(0, 12).map((book) => (
                <VideoCard
                  key={book.bookId}
                  title={book.bookName}
                  thumbnail={book.coverWap || book.cover || ""}
                  slug={book.bookId}
                  href={`/drama/dramabox/${book.bookId}`}
                  episode={book.chapterCount ? `${book.chapterCount} Ep` : undefined}
                  badge="DramaBox"
                />
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="text-center py-20 text-gray-500">Tidak dapat memuat data</div>
      )}
    </div>
  );
}
