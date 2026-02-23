export default function Loading() {
  return (
    <div className="min-h-screen bg-paper pt-32 px-6">
      <div className="max-w-[960px] mx-auto">
        {/* Skeleton header */}
        <div className="text-center mb-14">
          <div className="h-10 w-80 bg-border/50 rounded-xl mx-auto mb-4 animate-pulse" />
          <div className="h-5 w-96 bg-border/30 rounded-lg mx-auto animate-pulse" />
        </div>
        {/* Skeleton grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-border animate-pulse">
              <div className="h-5 w-32 bg-border/50 rounded mb-2" />
              <div className="h-3 w-20 bg-border/30 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
