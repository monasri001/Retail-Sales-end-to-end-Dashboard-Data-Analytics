import { cn } from '@/lib/utils';

const LoadingSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-lg bg-muted', className)} />
);

export const CardSkeleton = () => (
  <div className="glass-card p-6 space-y-3">
    <LoadingSkeleton className="h-4 w-24" />
    <LoadingSkeleton className="h-8 w-32" />
    <LoadingSkeleton className="h-3 w-20" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass-card p-6 space-y-4">
    <LoadingSkeleton className="h-5 w-40" />
    <LoadingSkeleton className="h-64 w-full" />
  </div>
);

export const TableSkeleton = () => (
  <div className="glass-card p-6 space-y-3">
    <LoadingSkeleton className="h-5 w-40" />
    {Array.from({ length: 5 }).map((_, i) => (
      <LoadingSkeleton key={i} className="h-10 w-full" />
    ))}
  </div>
);

export default LoadingSkeleton;
