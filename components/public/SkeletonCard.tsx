import { Skeleton } from '@/components/ui/skeleton'

export default function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-sm border border-brand-border/50 dark:border-dark-border flex flex-col h-full animate-pulse">
            {/* Skeleton image — aspect-square */}
            <Skeleton className="aspect-square w-full flex-shrink-0" />

            {/* Skeleton content */}
            <div className="flex flex-col flex-1 p-3 gap-2">
                {/* Category */}
                <Skeleton className="h-3 w-16" />
                {/* Title — 2 lines matching line-clamp-2 min-h */}
                <div className="min-h-[2.5rem] space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                {/* Price */}
                <Skeleton className="h-5 w-20 mt-1" />
                {/* View count */}
                <Skeleton className="h-3 w-16" />
                {/* Spacer */}
                <div className="flex-1" />
                {/* Button */}
                <Skeleton className="h-8 w-full mt-2 rounded-lg" />
            </div>
        </div>
    )
}
