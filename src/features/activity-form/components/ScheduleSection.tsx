"use client";

import { useEffect, useMemo, useState } from "react";
import { Control, useFieldArray, useWatch } from "react-hook-form";
import { Calendar } from "@/components/Reservation/Calendar";
import {
  formatDateKey,
  formatDisplayDate,
  getTodayTimestamp as getToday,
  getYearAndMonthFromTimestamp as getDate,
  parseDateKey,
} from "@/components/Reservation/utils";
import { YearAndMonth } from "@/components/Reservation/type";
import { TimePicker } from "./TimePicker";
import { ActivityFormValues } from "@/features/activity-form/types";
import { isTimeOverlap } from "@/features/activity-form/utils";
import { Plus as PlusIcon, Delete as DeleteIcon } from "@/constants/icons";
import Button from "@/components/Button/Button";
import FormController from "@/components/Form/FormController";

interface ScheduleSectionProps {
  control: Control<ActivityFormValues>;
  onDuplicateChange?: (hasDuplicate: boolean) => void;
}

type ScheduleItem = ActivityFormValues["schedules"][number];

const getNextDate = (date: string) => {
  const targetDate = new Date(parseDateKey(date));
  targetDate.setDate(targetDate.getDate() + 1);
  return formatDateKey(targetDate.getTime());
};

const getValidDate = () => {
  const date = new Set<string>();
  const today = new Date();

  for (let index = 0; index < 365; index++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + index);
    date.add(formatDateKey(currentDate.getTime()));
  }

  return date;
};

const ScheduleSection = ({
  control,
  onDuplicateChange,
}: ScheduleSectionProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });

  const watchedSchedules = useWatch({
    control,
    name: "schedules",
    defaultValue: [],
  });

  const schedules = useMemo(
    () => (watchedSchedules ?? []) as ScheduleItem[],
    [watchedSchedules],
  );

  const isDuplicate = useMemo(() => {
    for (let i = 0; i < schedules.length; i++) {
      for (let j = i + 1; j < schedules.length; j++) {
        const current = schedules[i];
        const next = schedules[j];

        if (
          current.date &&
          next.date &&
          current.date === next.date &&
          current.startTime &&
          current.endTime &&
          next.startTime &&
          next.endTime &&
          isTimeOverlap(
            current.startTime,
            current.endTime,
            next.startTime,
            next.endTime,
          )
        ) {
          return true;
        }
      }
    }

    return false;
  }, [schedules]);

  useEffect(() => {
    onDuplicateChange?.(isDuplicate);
  }, [isDuplicate, onDuplicateChange]);

  const validDate = useMemo(() => getValidDate(), []);

  const [yearMonth, setYearMonth] = useState<YearAndMonth>(() =>
    getDate(getToday()),
  );

  const [selectedDate, setSelectedDate] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  // s를 붙이지 않은 selectedTimestamp 사용
  const selectedTimestamp = useMemo(
    () => new Set(selectedDate.map((date) => parseDateKey(date))),
    [selectedDate],
  );

  // 두 날짜 사이의 연속된 날짜 반환
  const getDateRange = (startDate: string, endDate: string) => {
    const start = parseDateKey(startDate);
    const end = parseDateKey(endDate);

    const min = Math.min(start, end);
    const max = Math.max(start, end);

    const date: string[] = [];
    const currentDate = new Date(min);

    while (currentDate.getTime() <= max) {
      const dateKey = formatDateKey(currentDate.getTime());
      if (validDate.has(dateKey)) {
        date.push(dateKey);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return date;
  };

  const selectedRange = useMemo(() => {
    const sorted = [...selectedDate].sort();
    const range: { start: string; end: string }[] = [];

    for (const date of sorted) {
      const lastRange = range[range.length - 1];
      if (lastRange && getNextDate(lastRange.end) === date) {
        lastRange.end = date;
      } else {
        range.push({ start: date, end: date });
      }
    }

    return range;
  }, [selectedDate]);

  const handleRemove = (start: string, end: string) => {
    setSelectedDate((prev) =>
      prev.filter((date) => date < start || date > end),
    );
    if (startDate && startDate >= start && startDate <= end) {
      setStartDate(null);
    }
  };

  const handleClick = (timestamp: number) => {
    const dateStr = formatDateKey(timestamp);

    if (startDate) {
      const date = getDateRange(startDate, dateStr);
      setSelectedDate((prev) => [...new Set([...prev, ...date])]);
      setStartDate(null);
      return;
    }

    if (selectedDate.includes(dateStr)) {
      const range = selectedRange.find(
        (item) => item.start <= dateStr && dateStr <= item.end,
      );
      if (range) {
        handleRemove(range.start, range.end);
      }
      return;
    }

    setStartDate(dateStr);
    setSelectedDate((prev) => [...prev, dateStr]);
  };

  const handleReset = () => {
    setSelectedDate([]);
    setStartDate(null);
  };

  const handleChange = (nextMonth: YearAndMonth) => {
    const now = new Date();
    const isPastMonth =
      nextMonth.year < now.getFullYear() ||
      (nextMonth.year === now.getFullYear() &&
        nextMonth.month < now.getMonth());

    if (isPastMonth) {
      return;
    }

    setYearMonth(nextMonth);
  };

  const handleAdd = () => {
    if (selectedDate.length === 0) {
      setError("날짜를 선택해주세요.");
      return;
    }

    if (!startTime || !endTime) {
      setError("시간을 선택해주세요.");
      return;
    }

    if (startTime >= endTime) {
      setError("종료 시간은 시작 시간 이후로 선택해주세요.");
      return;
    }

    const conflictCount = selectedDate.reduce((count, date) => {
      const overlap = schedules.some(
        (schedule) =>
          schedule.date === date &&
          schedule.startTime &&
          schedule.endTime &&
          isTimeOverlap(
            startTime,
            endTime,
            schedule.startTime,
            schedule.endTime,
          ),
      );

      if (overlap) {
        return count + 1;
      }

      append({ date, startTime, endTime });
      return count;
    }, 0);

    if (conflictCount === selectedDate.length) {
      setError("이미 등록된 시간대입니다. 다시 확인해주세요.");
      return;
    }

    setError(
      conflictCount > 0
        ? `중복된 ${conflictCount}개 날짜를 제외하고 추가했습니다.`
        : "",
    );
    setSelectedDate([]);
    setStartDate(null);
    setStartTime("");
    setEndTime("");
  };

  const groupedSchedule = useMemo(() => {
    const groups = new Map<
      string,
      { index: number; scheduleItem: ScheduleItem }[]
    >();

    fields.forEach((_, index) => {
      const scheduleItem = schedules[index];
      if (!scheduleItem?.date) {
        return;
      }

      const daySchedule = groups.get(scheduleItem.date) ?? [];
      daySchedule.push({ index, scheduleItem });
      groups.set(scheduleItem.date, daySchedule);
    });

    return [...groups.entries()]
      .sort(([firstDate], [secondDate]) => firstDate.localeCompare(secondDate))
      .map(([date, daySchedule]) => ({
        date,
        daySchedule: daySchedule.sort((first, second) =>
          (first.scheduleItem.startTime ?? "").localeCompare(
            second.scheduleItem.startTime ?? "",
          ),
        ),
      }));
  }, [fields, schedules]);

  return (
    <FormController
      control={control}
      name="schedules"
      rules={{
        validate: (value) =>
          value?.length > 0 || "스케줄을 최소 하나 이상 추가해주세요.",
      }}
      render={() => (
        <div className="w-full">
          <p className="text-16-bold mb-2.5 block">예약 가능 시간대</p>

          <div className="flex flex-col gap-6 rounded-2xl border-2 border-gray-100 p-5 md:flex-row md:gap-8">
            <div className="shrink-0">
              <Calendar
                selectedTimestamp={selectedTimestamp}
                onSelectTimestamp={handleClick}
                selectedYearAndMonth={yearMonth}
                selectableDateKeys={validDate}
                onChangeYearAndMonth={handleChange}
              />
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-16-medium">
                    선택한 날짜
                    {selectedDate.length > 0 && ` (${selectedDate.length}일)`}
                  </p>

                  {selectedDate.length > 0 && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-14-medium text-gray-500 transition hover:text-gray-800"
                    >
                      초기화
                    </button>
                  )}
                </div>

                {selectedDate.length === 0 ? (
                  <p className="text-14-medium text-gray-400">
                    달력에서 날짜를 선택해주세요.
                  </p>
                ) : (
                  <>
                    <ul className="flex flex-wrap gap-2">
                      {selectedRange.map(({ start, end }) => {
                        const label =
                          start === end
                            ? formatDisplayDate(start)
                            : `${formatDisplayDate(start)} ~ ${formatDisplayDate(end)}`;

                        return (
                          <li key={start}>
                            <button
                              type="button"
                              onClick={() => handleRemove(start, end)}
                              className="text-14-medium bg-primary-100 text-primary-700 hover:bg-primary-500 flex items-center gap-1 rounded-full px-3 py-1.5 transition hover:text-white"
                              aria-label={`${label} 선택 해제`}
                            >
                              {label}
                              <span aria-hidden>×</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>

                    {startDate && (
                      <p className="text-14-medium text-primary-600 mt-2">
                        종료일을 선택해주세요.
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <TimePicker
                    value={startTime}
                    onChange={setStartTime}
                    label="시작 시간"
                  />
                </div>

                <div className="mb-4 h-0.5 w-2 shrink-0 bg-gray-800" />

                <div className="flex-1">
                  <TimePicker
                    value={endTime}
                    onChange={setEndTime}
                    label="종료 시간"
                    minTime={startTime}
                    includeMidnight
                  />
                </div>
              </div>

              <Button
                variant="mainBlue"
                type="button"
                onClick={handleAdd}
                icon={<PlusIcon width={20} height={20} />}
                className="text-16-bold h-12 justify-center gap-1 rounded-xl transition hover:brightness-95"
              >
                시간대 추가
              </Button>

              {error && <p className="text-14-medium text-red-500">{error}</p>}
            </div>
          </div>

          {groupedSchedule.length > 0 && (
            <div className="mt-5 flex flex-col gap-4">
              <p className="text-16-medium block">
                등록된 스케줄 ({schedules.length}개)
              </p>

              {groupedSchedule.map(({ date, daySchedule }) => (
                <div
                  key={date}
                  className="rounded-2xl border border-gray-100 p-4"
                >
                  <p className="text-16-bold mb-2 text-gray-950">
                    {formatDisplayDate(date)}
                  </p>

                  <ul className="flex flex-col gap-2">
                    {daySchedule.map(({ index, scheduleItem }) => (
                      <li
                        key={fields[index]?.id ?? index}
                        className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2.5"
                      >
                        <span className="text-16-medium text-gray-950">
                          {scheduleItem.startTime} ~ {scheduleItem.endTime}
                        </span>

                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-gray-500 transition hover:text-red-500"
                          aria-label={`${formatDisplayDate(date)} ${scheduleItem.startTime} ~ ${scheduleItem.endTime} 삭제`}
                        >
                          <DeleteIcon width={20} height={20} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {isDuplicate && (
                <p className="text-14-medium text-red-500">
                  중복 시간대가 있으니, 등록된 스케줄을 확인해주세요.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    />
  );
};

export { ScheduleSection };
