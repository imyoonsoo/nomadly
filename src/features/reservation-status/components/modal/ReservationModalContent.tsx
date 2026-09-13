"use client";

import { Suspense, useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ReservationStatus } from "@/features/reservation-status/type";
import ReservationStatusTab from "@/features/reservation-status/components/modal/ReservationStatusTab";
import ReservationScheduleSelect from "@/features/reservation-status/components/modal/ReservationScheduleSelect";
import ReservationCard from "@/features/reservation-status/components/modal/ReservationCard";
import { Delete } from "@/constants/icons";
import { formatKoreanDate } from "@/features/reservation-status/utils";
import {
  reservationsQueryOptions,
  reservedScheduleQueryOptions,
} from "@/features/reservation-status/queries/query";
import { useUpdateReservationStatus } from "@/features/reservation-status/hooks/useReservationStatus";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { ModalSkeleton, CardsSkeleton } from "./ModalSkeleton";

interface ReservationModalContentProps {
  selectedDate: string;
  activityId: number;
  onClose: () => void;
  isFullPage?: boolean;
}

interface ReservationsSectionProps {
  activityId: number;
  scheduleId: number;
  status: ReservationStatus;
  isFullPage: boolean;
}

const ReservationsSection = ({
  activityId,
  scheduleId,
  status,
  isFullPage,
}: ReservationsSectionProps) => {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1280);
    };

    checkTablet();
    window.addEventListener("resize", checkTablet);

    return () => {
      window.removeEventListener("resize", checkTablet);
    };
  }, []);

  const loadSize = isFullPage || isTablet ? 3 : 2;
  const [visibleCount, setVisibleCount] = useState(loadSize);
  const [prevLoadSize, setPrevLoadSize] = useState(loadSize);

  if (loadSize !== prevLoadSize) {
    setPrevLoadSize(loadSize);
    setVisibleCount(loadSize);
  }

  const { data } = useSuspenseQuery(
    reservationsQueryOptions(activityId, scheduleId, status),
  );

  const updateReservationStatusMutation = useUpdateReservationStatus();

  const reservations = data.reservations;
  const visibleReservations = reservations.slice(0, visibleCount);
  const hasMore = visibleCount < reservations.length;

  const handleScrollReservationList = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;

    const isBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 10;

    if (!isBottom || !hasMore) {
      return;
    }

    setVisibleCount((prev) => Math.min(prev + loadSize, reservations.length));
  };

  const handleApprove = (reservationId: number) => {
    updateReservationStatusMutation.mutate({
      activityId,
      reservationId,
      status: "confirmed",
    });
  };

  const handleDecline = (reservationId: number) => {
    updateReservationStatusMutation.mutate({
      activityId,
      reservationId,
      status: "declined",
    });
  };

  return (
    <div
      onScroll={handleScrollReservationList}
      className={`scrollbar-hide h-60 overflow-y-auto pr-1 md:h-[min(350px,calc(85vh-280px))] xl:h-57.5 ${
        isFullPage
          ? "h-[calc(100vh-300px)] md:h-[calc(100vh-320px)] xl:h-57.5"
          : ""
      } `}
    >
      <div className="flex flex-col gap-3">
        {visibleReservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            status={status}
            onApprove={handleApprove}
            onDecline={handleDecline}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-10-medium md:text-14-medium py-3 text-center text-gray-400">
          더 불러오는 중...
        </div>
      )}
    </div>
  );
};

interface ReservationScheduleSectionProps {
  activityId: number;
  selectedDate: string;
  isFullPage: boolean;
}

const ReservationScheduleSection = ({
  activityId,
  selectedDate,
  isFullPage,
}: ReservationScheduleSectionProps) => {
  const { data: schedules } = useSuspenseQuery(
    reservedScheduleQueryOptions(activityId, selectedDate),
  );

  const [selectedScheduleId, setSelectedScheduleId] = useState(
    schedules[0]?.scheduleId ?? 0,
  );
  const [selectedStatus, setSelectedStatus] =
    useState<ReservationStatus>("pending");

  const selectedSchedule = schedules.find(
    (schedule) => schedule.scheduleId === selectedScheduleId,
  );

  return (
    <>
      <ReservationStatusTab
        selectedStatus={selectedStatus}
        onChangeStatus={setSelectedStatus}
        count={
          selectedSchedule?.count ?? {
            pending: 0,
            confirmed: 0,
            declined: 0,
          }
        }
      />

      <div className="mt-6">
        <p className="text-16-bold mb-3 text-black">예약 시간</p>

        <ReservationScheduleSelect
          schedules={schedules}
          selectedScheduleId={selectedScheduleId}
          onChangeScheduleId={setSelectedScheduleId}
        />
      </div>

      <div className="mt-6">
        <p className="text-16-bold mb-3 text-black">예약 내역</p>

        {selectedScheduleId > 0 && (
          <ErrorBoundary
            key={`${selectedScheduleId}-${selectedStatus}`}
            fallback={
              <div className="text-14-medium text-gray-400">
                예약 내역을 불러오지 못했습니다.
              </div>
            }
          >
            <Suspense fallback={<CardsSkeleton />}>
              <ReservationsSection
                activityId={activityId}
                scheduleId={selectedScheduleId}
                status={selectedStatus}
                isFullPage={isFullPage}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </>
  );
};

export const ReservationModalContent = ({
  selectedDate,
  activityId,
  onClose,
  isFullPage = false,
}: ReservationModalContentProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-20-bold text-black">
          {formatKoreanDate(selectedDate)}
        </h2>

        <button type="button" onClick={onClose}>
          <Delete className="h-6 w-6 hover:translate-y-0.5" />
        </button>
      </div>

      <ErrorBoundary
        key={`${activityId}-${selectedDate}`}
        fallback={
          <div className="text-14-medium mt-6 text-red-500">
            예약 시간을 불러오지 못했습니다.
          </div>
        }
      >
        <Suspense fallback={<ModalSkeleton />}>
          <ReservationScheduleSection
            activityId={activityId}
            selectedDate={selectedDate}
            isFullPage={isFullPage}
          />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};
