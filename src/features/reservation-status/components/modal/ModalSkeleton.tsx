import Skeleton from "@/components/Skeleton/Skeleton";

export const CardSkeleton = () => (
  <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-16" />
    </div>
    <Skeleton className="h-8 w-16 rounded-lg" />
  </div>
);

export const CardsSkeleton = () => (
  <div role="status" aria-live="polite">
    <span className="sr-only">예약 내역을 불러오는 중입니다</span>
    <div aria-hidden="true" className="flex flex-col gap-3">
      {Array.from({ length: 2 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const ModalSkeleton = () => (
  <div role="status" aria-live="polite">
    <span className="sr-only">예약 관리 정보를 불러오는 중입니다</span>
    <div aria-hidden="true">
      <div className="mt-4 grid grid-cols-3 gap-4 border-b border-gray-300 pb-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>

      <div className="mt-6">
        <Skeleton className="mb-3 h-5 w-16" />
        <Skeleton className="h-13.5 w-full rounded-2xl" />
      </div>

      <div className="mt-6">
        <Skeleton className="mb-3 h-5 w-16" />
        <CardsSkeleton />
      </div>
    </div>
  </div>
);
