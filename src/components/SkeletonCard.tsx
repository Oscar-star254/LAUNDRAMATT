export default function SkeletonCard({ compact }: { compact?: boolean }) {
  return (
    <div className="bg-white dark:bg-[#0f2018] rounded-2xl overflow-hidden border border-[#d1e8d9] dark:border-[#1a3528]">
      <div className={`skeleton ${compact ? 'h-36' : 'h-44'} w-full`} />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-4/5 rounded" />
        <div className="skeleton h-3 w-3/5 rounded" />
        <div className="skeleton h-5 w-2/5 rounded" />
        <div className="skeleton h-3 w-full rounded mt-3" />
      </div>
    </div>
  );
}
