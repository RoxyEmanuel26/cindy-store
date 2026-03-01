import { Skeleton } from '@/components/ui/skeleton'

export default function SkeletonCard() {
    return (
        <div className="rounded-xl border bg-white dark:bg-dark-surface p-4 space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    )
}
