import { Skeleton } from '@/components/ui/skeleton'

export default function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-sm">
            <Skeleton className="aspect-square w-full" />
            <div className="p-3 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-5 w-20 mt-2" />
                <Skeleton className="h-8 w-full mt-3" />
            </div>
        </div>
    )
}
