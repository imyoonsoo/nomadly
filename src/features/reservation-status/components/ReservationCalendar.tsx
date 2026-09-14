"use client";

import { useEffect, useMemo, useState } from "react";
import { ReservationDashboardItem } from "@/features/reservation-status/type";
import {
  formatDateKey,
  getCalendarDates,
} from "@/features/reservation-status/utils";
import { AltLeft } from "@/constants/icons";
import { AltRight } from "@/constants/icons";
import CalendarCell from "@/features/reservation-status/components/CalendarCell";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface ReservationCalendarProps {
  reservations: ReservationDashboardItem[];
  onClickDate: (date: string) => void;
  onChangeMonth: (value: { year: string; month: string }) => void;
}

const ReservationCalendar = ({
  reservations,
  onClickDate,
  onChangeMonth,
}: ReservationCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDates = useMemo(
    () => getCalendarDates(year, month),
    [year, month],
  );

  const reservationMap = useMemo(() => {
    return new Map(reservations.map((item) => [item.date, item]));
  }, [reservations]);

  const handlePrevMonthButtonClick = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonthButtonClick = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  useEffect(() => {
    onChangeMonth({
      year: String(year),
      month: String(month + 1).padStart(2, "0"),
    });
  }, [year, month, onChangeMonth]);

  const handleTodayButtonClick = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  return (
    <div className="w-full max-w-160 overflow-hidden rounded-3xl bg-white md:shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
      <div className="relative mb-2 flex h-11 items-center justify-center px-7 md:mt-5 md:mb-7.5">
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={handlePrevMonthButtonClick}
            className="h-6 w-6 hover:-translate-y-px"
          >
            <AltLeft className="h-full w-full" />
          </button>

          <h2 className="text-16-bold md:text-20-bold text-black">
            {year}년 {month + 1}월
          </h2>

          <button
            type="button"
            onClick={handleNextMonthButtonClick}
            className="h-6 w-6 hover:-translate-y-px"
          >
            <AltRight className="h-full w-full" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleTodayButtonClick}
          className="border-primary-500 text-13-bold text-primary-500 hover:bg-primary-100 absolute right-5 h-9 rounded-xl border px-4 transition md:right-7"
        >
          오늘
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-gray-200">
        {WEEK_DAYS.map((day, i) => (
          <div
            key={`${day}-${i}`}
            className="text-13-bold md:text-16-bold h-11 text-center leading-10 text-gray-900 md:h-13.75 md:pb-3"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarDates.map((date) => {
          const dateKey = formatDateKey(date);

          return (
            <CalendarCell
              key={dateKey}
              date={date}
              currentMonth={month}
              reservation={reservationMap.get(dateKey)}
              onClickDate={onClickDate}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ReservationCalendar;
