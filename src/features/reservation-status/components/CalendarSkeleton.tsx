import Skeleton from "@/components/Skeleton/Skeleton";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CALENDAR_CELL_COUNT = 35;

export const CalendarSkeleton = () => (
  <div
    role="status"
    aria-live="polite"
    className="w-full max-w-160 overflow-hidden rounded-3xl bg-white md:shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
  >
    <span className="sr-only">예약 현황을 불러오는 중입니다</span>
    <div aria-hidden="true">
      <div className="mb-2 flex h-11 items-center justify-center md:mt-5 md:mb-7.5">
        <Skeleton className="h-6 w-32 rounded-lg" />
      </div>

      <div className="grid grid-cols-7 border-b border-gray-200">
        {WEEK_DAYS.map((day, i) => (
          <div
            key={`${day}-${i}`}
            className="text-13-bold md:text-16-bold h-11 text-center leading-10 text-gray-300 md:h-13.75 md:pb-3"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {Array.from({ length: CALENDAR_CELL_COUNT }).map((_, i) => (
          <div
            key={i}
            className="flex h-26 w-full items-start justify-start border-b border-gray-100 px-1 pt-2 md:h-31 md:px-3 md:pt-4"
          >
            <Skeleton className="h-5 w-5 rounded-full md:h-7 md:w-7" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
