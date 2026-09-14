"use client";
import { Suspense, useState, useTransition } from "react";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import FilterButton from "@/components/FilterButton/FilterButton";
import ReservedCard from "./ReservedCard";
import { myReservationsInfiniteQuery } from "@/features/reservations/queries";
import EmptyIcon from "@/assets/images/empty.svg";
import Button from "@/components/Button/Button";
import type { Reservation } from "../types";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import ReservedCardListSkeleton, {
  ReservedCardSkeleton,
} from "./ReservedCardListSkeleton";

const FILTERS = [
  "예약 대기",
  "예약 취소",
  "예약 완료",
  "예약 거절",
  "체험 완료",
];

const FILTER_STATUS_MAP: Record<string, string> = {
  "예약 대기": "pending",
  "예약 취소": "canceled",
  "예약 완료": "confirmed",
  "예약 거절": "declined",
  "체험 완료": "completed",
};

const sortReservations = (reservations: Reservation[]) => {
  const sortedReservations = [...reservations].sort(
    (a, b) =>
      Number(a.date.split("-").join("")) - Number(b.date.split("-").join("")),
  );
  return sortedReservations;
};

interface ReservedCardListEmptyProps {
  message: string;
  action?: React.ReactNode;
}

const ReservedCardListEmpty = ({
  message,
  action,
}: ReservedCardListEmptyProps) => {
  const router = useRouter();

  return (
    <div className="mt-2.5 flex h-full w-full flex-col items-center justify-center gap-7.5">
      <div>
        <EmptyIcon width={180} height={203} />
        <p>{message}</p>
      </div>
      {action ?? (
        <Button
          variant="mainBlue"
          height="custom"
          className="text-16-bold h-13.5 w-45.5 rounded-2xl"
          onClick={() => router.push("/")}
        >
          둘러보기
        </Button>
      )}
    </div>
  );
};

const ReservedCardListContent = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeStatus = activeFilter
    ? FILTER_STATUS_MAP[activeFilter]
    : undefined;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      ...myReservationsInfiniteQuery({ size: 10, status: activeStatus }),
      retry: 1,
    });

  const { targetRef } = useInfiniteScroll({
    onIntersect: fetchNextPage,
    hasNextPage: !!hasNextPage,
    isLoading: isFetchingNextPage,
  });

  const handleFilterButtonClick = (filter: string) => {
    startTransition(() => {
      setActiveFilter((prev) => (prev === filter ? null : filter));
    });
  };

  const reservations = sortReservations(
    data.pages.flatMap((page) => page.reservations),
  );

  if (!activeFilter && !reservations.length) {
    return <ReservedCardListEmpty message="아직 예약된 체험이 없어요" />;
  }

  return (
    <div className="flex flex-col gap-7.5">
      <div className="scrollbar-hide flex gap-2 overflow-x-auto">
        {FILTERS.map((filter) => (
          <FilterButton
            key={filter}
            isActive={activeFilter === filter}
            onClick={() => handleFilterButtonClick(filter)}
          >
            {filter}
          </FilterButton>
        ))}
      </div>
      <div
        className={`flex flex-col gap-7.5 transition-opacity ${isPending ? "opacity-60" : ""}`}
      >
        {reservations.map((reservation) => (
          <ReservedCard key={reservation.id} reservation={reservation} />
        ))}
      </div>
      <div ref={targetRef} />
      {isFetchingNextPage && <ReservedCardSkeleton />}
    </div>
  );
};

export const ReservedCardList = () => {
  return (
    <ErrorBoundary
      fallback={({ reset }) => (
        <ReservedCardListEmpty
          message="예약 목록을 불러오지 못했어요"
          action={
            <button
              type="button"
              onClick={reset}
              className="text-14-medium text-primary-500 underline"
            >
              다시 시도하기
            </button>
          }
        />
      )}
    >
      <Suspense fallback={<ReservedCardListSkeleton />}>
        <ReservedCardListContent />
      </Suspense>
    </ErrorBoundary>
  );
};
