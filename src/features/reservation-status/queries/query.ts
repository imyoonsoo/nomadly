import { queryOptions } from "@tanstack/react-query";
import {
  getMyActivities,
  getReservationDashboard,
  getReservations,
  getReservedSchedule,
} from "@/features/reservation-status/api/reservationStatus";
import { ReservationStatus } from "@/features/reservations/types";

export const reservationStatusKeys = {
  all: ["reservation-status"] as const,
  activities: () => [...reservationStatusKeys.all, "activities"] as const,
  dashboard: (activityId: number, year: string, month: string) =>
    [
      ...reservationStatusKeys.all,
      "dashboard",
      activityId,
      year,
      month,
    ] as const,
  reservedSchedule: (activityId: number, date: string) =>
    [
      ...reservationStatusKeys.all,
      "reserved-schedule",
      activityId,
      date,
    ] as const,
  reservations: (
    activityId: number,
    scheduleId: number,
    status: ReservationStatus,
  ) =>
    [
      ...reservationStatusKeys.all,
      "reservations",
      activityId,
      scheduleId,
      status,
    ] as const,
};

export const myActivitiesQueryOptions = () =>
  queryOptions({
    queryKey: reservationStatusKeys.activities(),
    queryFn: getMyActivities,
  });

export const reservationDashboardQueryOptions = (
  activityId: number,
  year: string,
  month: string,
) =>
  queryOptions({
    queryKey: reservationStatusKeys.dashboard(activityId, year, month),
    queryFn: () => getReservationDashboard({ activityId, year, month }),
  });

export const reservedScheduleQueryOptions = (
  activityId: number,
  date: string | null,
) =>
  queryOptions({
    queryKey: reservationStatusKeys.reservedSchedule(activityId, date ?? ""),
    queryFn: () =>
      getReservedSchedule({
        activityId,
        date: date as string,
      }),
  });

export const reservationsQueryOptions = (
  activityId: number,
  scheduleId: number,
  status: ReservationStatus,
) =>
  queryOptions({
    queryKey: reservationStatusKeys.reservations(
      activityId,
      scheduleId,
      status,
    ),
    queryFn: () =>
      getReservations({
        activityId,
        scheduleId,
        status,
      }),
  });
