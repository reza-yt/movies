import { SkeletonGrid } from "@/components/CinemaLoader";

export default function Loading() {
  return (
    <div className="space-y-8 animate-fade-up">
      <div className="space-y-2">
        <div className="h-8 w-32 rounded-lg bg-gray-800/50 animate-shimmer" />
        <div className="h-4 w-56 rounded-lg bg-gray-800/30 animate-shimmer" />
      </div>
      <SkeletonGrid count={18} />
    </div>
  );
}
