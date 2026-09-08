"use client";

import { useEffect, useMemo, useState } from "react";
import { Control, useFieldArray, useWatch } from "react-hook-form";
import { Calendar } from "@/components/Reservation/Calendar";
import {
  formatDateKey,
  formatDisplayDate,
  getTodayTimestamp,
  getYearAndMonthFromTimestamp,
  parseDateKey,
} from "@/components/Reservation/utils";
import { YearAndMonth } from "@/components/Reservation/type";
import { TimePicker } from "./TimePicker";
import { ActivityFormValues } from "@/features/activity-form/types";
import {
  getDateRange,
  getNextDate,
  getValidDates,
  isTimeOverlap,
} from "@/features/activity-form/utils";
import { Plus as PlusIcon, Delete as DeleteIcon } from "@/constants/icons";
import Button from "@/components/Button/Button";
import FormController from "@/components/Form/FormController";

interface ScheduleSectionProps {
  control: Control<ActivityFormValues>;
  onDuplicateChange?: (hasDuplicate: boolean) => void;
}

type ScheduleItem = ActivityFormValues["schedules"][number];

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

  const validDates = useMemo(() => getValidDates(), []);

  const [yearMonth, setYearMonth] = useState<YearAndMonth>(() =>
    getYearAndMonthFromTimestamp(getTodayTimestamp()),
  );

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  const selectedTimestamps = useMemo(
    () => new Set(selectedDates.map((date) => parseDateKey(date))),
    [selectedDates],
  );

  const selectedRanges = useMemo(() => {
    const sorted = [...selectedDates].sort();
    const ranges: { start: string; end: string }[] = [];

    for (const date of sorted) {
      const lastRange = ranges[ranges.length - 1];
      if (lastRange && getNextDate(lastRange.end) === date) {
        lastRange.end = date;
      } else {
        ranges.push({ start: date, end: date });
      }
    }

    return ranges;
  }, [selectedDates]);

  const handleRangeRemove = (start: string, end: string) => {
    setSelectedDates((prev) =>
      prev.filter((date) => date < start || date > end),
    );
    if (startDate && startDate >= start && startDate <= end) {
      setStartDate(null);
    }
  };

  const handleCalendarDateClick = (timestamp: number) => {
    const dateStr = formatDateKey(timestamp);

    if (startDate) {
      const dates = getDateRange(startDate, dateStr, validDates);
      setSelectedDates((prev) => [...new Set([...prev, ...dates])]);
      setStartDate(null);
      return;
    }

    if (selectedDates.includes(dateStr)) {
      const range = selectedRanges.find(
        (item) => item.start <= dateStr && dateStr <= item.end,
      );
      if (range) {
        handleRangeRemove(range.start, range.end);
      }
      return;
    }

    setStartDate(dateStr);
    setSelectedDates((prev) => [...prev, dateStr]);
  };

  const handleResetButtonClick = () => {
    setSelectedDates([]);
    setStartDate(null);
  };

  const handleCalendarMonthChange = (nextMonth: YearAndMonth) => {
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

  const handleAddButtonClick = () => {
    if (selectedDates.length === 0) {
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

    const conflictDates = selectedDates.filter((date) =>
      schedules.some(
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
      ),
    );

    if (conflictDates.length === selectedDates.length) {
      setError("이미 등록된 시간대입니다. 다시 확인해주세요.");
      return;
    }

    const newSchedules = selectedDates
      .filter((date) => !conflictDates.includes(date))
      .map((date) => ({ date, startTime, endTime }));

    append(newSchedules);

    setError(
      conflictDates.length > 0
        ? `중복된 ${conflictDates.length}개 날짜를 제외하고 추가했습니다.`
        : "",
    );
    setSelectedDates([]);
    setStartDate(null);
    setStartTime("");
    setEndTime("");
  };

  const groupedSchedules = useMemo(() => {
    const groups = new Map<
      string,
      { index: number; scheduleItem: ScheduleItem }[]
    >();

    fields.forEach((_, index) => {
      const scheduleItem = schedules[index];
      if (!scheduleItem?.date) {
        return;
      }

      const daySchedules = groups.get(scheduleItem.date) ?? [];
      daySchedules.push({ index, scheduleItem });
      groups.set(scheduleItem.date, daySchedules);
    });

    return [...groups.entries()]
      .sort(([firstDate], [secondDate]) => firstDate.localeCompare(secondDate))
      .map(([date, daySchedules]) => ({
        date,
        daySchedules: daySchedules.sort((first, second) =>
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
                selectedTimestamps={selectedTimestamps}
                onSelectTimestamp={handleCalendarDateClick}
                selectedYearAndMonth={yearMonth}
                selectableDateKeys={validDates}
                onChangeYearAndMonth={handleCalendarMonthChange}
              />
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-16-medium">
                    선택한 날짜
                    {selectedDates.length > 0 && ` (${selectedDates.length}일)`}
                  </p>

                  {selectedDates.length > 0 && (
                    <button
                      type="button"
                      onClick={handleResetButtonClick}
                      className="text-14-medium text-gray-500 transition hover:text-gray-800"
                    >
                      초기화
                    </button>
                  )}
                </div>

                {selectedDates.length === 0 ? (
                  <p className="text-14-medium text-gray-400">
                    달력에서 날짜를 선택해주세요.
                  </p>
                ) : (
                  <>
                    <ul className="flex flex-wrap gap-2">
                      {selectedRanges.map(({ start, end }) => {
                        const label =
                          start === end
                            ? formatDisplayDate(start)
                            : `${formatDisplayDate(start)} ~ ${formatDisplayDate(end)}`;

                        return (
                          <li key={start}>
                            <button
                              type="button"
                              onClick={() => handleRangeRemove(start, end)}
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
                onClick={handleAddButtonClick}
                icon={<PlusIcon width={20} height={20} />}
                className="text-16-bold h-12 justify-center gap-1 rounded-xl transition hover:brightness-95"
              >
                시간대 추가
              </Button>

              {error && <p className="text-14-medium text-red-500">{error}</p>}
            </div>
          </div>

          {groupedSchedules.length > 0 && (
            <div className="mt-5 flex flex-col gap-4">
              <p className="text-16-medium block">
                등록된 스케줄 ({schedules.length}개)
              </p>

              {groupedSchedules.map(({ date, daySchedules }) => (
                <div
                  key={date}
                  className="rounded-2xl border border-gray-100 p-4"
                >
                  <p className="text-16-bold mb-2 text-gray-950">
                    {formatDisplayDate(date)}
                  </p>

                  <ul className="flex flex-col gap-2">
                    {daySchedules.map(({ index, scheduleItem }) => (
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
