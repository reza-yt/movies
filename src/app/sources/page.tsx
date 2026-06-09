import SourceSelector from "@/components/SourceSelector";

export const metadata = {
  title: "All Sources - StreamFlix",
};

export default function SourcesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Sources</h1>
      <p className="text-gray-400 mb-8">Browse from 50+ streaming sources</p>
      <SourceSelector />
    </div>
  );
}
