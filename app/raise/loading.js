export default function Loading() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-[3px] border-blue border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted text-sm">Loading your form...</p>
      </div>
    </div>
  );
}
