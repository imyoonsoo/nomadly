"use client";

import { Suspense, useState, useTransition } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import ReservationCalendar from "@/features/reservation-status/components/ReservationCalendar";
import { CalendarSkeleton } from "@/features/reservation-status/components/CalendarSkeleton";
import EmptyReservationStatus from "@/features/reservation-status/components/EmptyReservationStatus";
import { ReservationModal } from "@/features/reservation-status/components/modal/ReservationModal";
import {
  myActivitiesQueryOptions,
  reservationDashboardQueryOptions,
} from "@/features/reservation-status/queries/query";
import SelectDropdown from "@/components/SelectDropdown/SelectDropdown";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import Error from "@/assets/images/empty-notFound.svg";
import Skeleton from "@/components/Skeleton/Skeleton";

const getCurrentYearMonth = () => {
  const today = new Date();
  return {
    year: String(today.getFullYear()),
    month: String(today.getMonth() + 1).padStart(2, "0"),
  };
};

const ReservationStatusPageSkeleton = () => (
  <>
    <div className="max-w-160 pb-4.5 md:pb-6 xl:pb-7.5">
      <Skeleton className="h-13.5 w-full rounded-2xl" />
    </div>
    <CalendarSkeleton />
  </>
);

interface ReservationDashboardProps {
  activityId: number;
  year: string;
  month: string;
  onDateClick: (date: string) => void;
  onChangeMonth: (value: { year: string; month: string }) => void;
}

const ReservationDashboard = ({
  activityId,
  year,
  month,
  onDateClick,
  onChangeMonth,
}: ReservationDashboardProps) => {
  const { data: reservations } = useSuspenseQuery(
    reservationDashboardQueryOptions(activityId, year, month),
  );

  return (
    <ReservationCalendar
      reservations={reservations}
      onClickDate={onDateClick}
      onChangeMonth={onChangeMonth}
    />
  );
};

const ReservationStatusContent = () => {
  const { data: activitiesData } = useSuspenseQuery(
    myActivitiesQueryOptions(),
  );
  const activities = activitiesData.activities;

  const [selectedActivityId, setSelectedActivityId] = useState(
    activities[0]?.id ?? 0,
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [{ year, month }, setYearMonth] = useState(getCurrentYearMonth);
  const [, startTransition] = useTransition();

  if (activities.length === 0) {
    return <EmptyReservationStatus message="아직 등록한 체험이 없어요" />;
  }

  const activityOptions = activities.map((activity) => ({
    value: activity.id,
    label: activity.title,
  }));

  const handleChangeActivity = (value: string | number) => {
    startTransition(() => setSelectedActivityId(Number(value)));
  };

  const handleChangeMonth = (value: { year: string; month: string }) => {
    startTransition(() => setYearMonth(value));
  };

  return (
    <>
      <div className="max-w-160 pb-4.5 md:pb-6 xl:pb-7.5">
        <SelectDropdown
          options={activityOptions}
          selectedValue={selectedActivityId}
          onChange={handleChangeActivity}
        />
      </div>

      <ErrorBoundary
        fallback={
          <EmptyReservationStatus
            image={<Error className="h-45.5 w-45.5" />}
            message="예약 현황을 불러오지 못했습니다."
          />
        }
      >
        <Suspense fallback={<CalendarSkeleton />}>
          <ReservationDashboard
            activityId={selectedActivityId}
            year={year}
            month={month}
            onDateClick={setSelectedDate}
            onChangeMonth={handleChangeMonth}
          />
        </Suspense>
      </ErrorBoundary>

      <ReservationModal
        open={!!selectedDate}
        activityId={selectedActivityId}
        selectedDate={selectedDate}
        onClose={() => setSelectedDate(null)}
      />
    </>
  );
};

export const ReservationStatusPage = () => {
  return (
    <section className="w-full max-w-200">
      <ErrorBoundary
        fallback={
          <EmptyReservationStatus
            image={<Error className="h-45.5 w-45.5" />}
            message="체험 목록을 불러오지 못했습니다."
          />
        }
      >
        <Suspense fallback={<ReservationStatusPageSkeleton />}>
          <ReservationStatusContent />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
};
