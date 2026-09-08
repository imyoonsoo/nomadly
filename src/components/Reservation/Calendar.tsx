"use client";

import { AltLeft, AltRight } from "@/constants/icons";
import type { CalendarProps } from "./type";
import {
  formatDateKey,
  getTimestampListForCalendar,
  getTodayTimestamp,
  getYearAndMonthFromTimestamp,
  isCurrentMonth,
  isToday,
  WEEK_DAYS,
} from "./utils";

const Calendar = ({
  selectedYearAndMonth,
  selectableDateKeys,
  selectedTimestamps,
  onChangeYearAndMonth,
  onSelectTimestamp,
}: CalendarProps) => {
  const { year, month } = selectedYearAndMonth;
  const calendarTimestamps = getTimestampListForCalendar(year, month);

  const handleMonthShift = (delta: number) => {
    const nextDate = new Date(year, month + delta, 1);
    onChangeYearAndMonth({
      year: nextDate.getFullYear(),
      month: nextDate.getMonth(),
    });
  };

  const handleTodayClick = () => {
    const today = getTodayTimestamp();
    onChangeYearAndMonth(getYearAndMonthFromTimestamp(today));
    onSelectTimestamp(today);
  };

  const monthLabel = new Date(year, month, 1).toLocaleString("en-US", {
    month: "long",
  });

  return (
    <div className="flex flex-col gap-2">
      {/* 헤더 */}
      <div className="relative flex min-h-9 items-center justify-center">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="이전 달"
            onClick={() => handleMonthShift(-1)}
            className="flex h-6 w-6 items-center justify-center"
          >
            <AltLeft className="h-full w-full" />
          </button>

          <p className="text-16-medium text-gray-950">
            {monthLabel} {year}
          </p>

          <button
            type="button"
            aria-label="다음 달"
            onClick={() => handleMonthShift(1)}
            className="flex h-6 w-6 items-center justify-center"
          >
            <AltRight className="h-full w-full" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleTodayClick}
          className="border-primary-500 text-13-bold text-primary-500 hover:bg-primary-100 absolute right-0 h-9 rounded-xl border px-4 transition"
        >
          오늘
        </button>
      </div>

      {/* 달력 그리드 */}
      <div className="gap-x-1.17 grid grid-cols-7 gap-y-2">
        {WEEK_DAYS.map((day, index) => (
          <div
            key={`${day}-${index}`}
            className="text-16-medium flex h-11.5 w-11.5 items-center justify-center text-center font-semibold text-gray-800"
          >
            {day}
          </div>
        ))}

        {calendarTimestamps.map((timestamp) => {
          const dateKey = formatDateKey(timestamp);
          const isSelected = selectedTimestamps.has(timestamp);
          const isTodayDate = isToday(timestamp);
          const isCurrentMonthDate = isCurrentMonth(timestamp, month);
          const isSelectable =
            isCurrentMonthDate && selectableDateKeys.has(dateKey);
          const dayNumber = new Date(timestamp).getDate();

          const getDayStyle = () => {
            if (isSelected) return "bg-primary-500 text-white";
            if (isTodayDate) return "bg-primary-100 text-primary-500";
            if (isSelectable) return "text-gray-950 hover:bg-gray-50";
            return "cursor-not-allowed text-gray-300";
          };

          return (
            <button
              key={timestamp}
              type="button"
              disabled={!isSelectable}
              aria-pressed={isSelected}
              onClick={() => onSelectTimestamp(timestamp)}
              className={`text-16-medium mx-auto flex h-11.5 w-11.5 items-center justify-center rounded-full transition ${getDayStyle()}`}
            >
              {dayNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { Calendar };
