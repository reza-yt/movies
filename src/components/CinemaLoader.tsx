"use client";

export default function CinemaLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      {/* Film Reel */}
      <div className="relative w-20 h-20">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-reel-spin">
          {/* Sprocket holes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <div
              key={deg}
              className="absolute w-2.5 h-2.5 bg-red-500/60 rounded-full"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${deg}deg) translateY(-32px) translate(-50%, -50%)`,
              }}
            />
          ))}
        </div>
        {/* Center hub */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 animate-projector shadow-lg shadow-red-500/50" />
        </div>
      </div>

      {/* Loading text */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400 font-medium">{text}</span>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-gray-900/50 border border-gray-800/50">
      <div className="aspect-[2/3] bg-gray-800/50 animate-shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-800/50 rounded animate-shimmer w-3/4" />
        <div className="h-3 bg-gray-800/50 rounded animate-shimmer w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
