"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/Button/Button";
import Skeleton from "@/components/Skeleton/Skeleton";
import { Minus, Plus, Search } from "@/constants/icons";
import { Calendar } from "./Calendar";
import type { TabletReservationPickerProps } from "./type";
import useAvailableReservationSchedules from "@/hooks/useAvailableReservationSchedules";
import {
  formatDateKey,
  getSelectableDateKeys,
  getTodayTimestamp,
  getYearAndMonthFromTimestamp,
  parseDateKey,
} from "./utils";

const MIN_HEAD_COUNT = 1;
const MAX_HEAD_COUNT = 10;

const TabletReservationPicker = ({
  activityId,
  defaultSelectedSchedule = null,
  defaultHeadCount = MIN_HEAD_COUNT,
  onConfirm,
}: TabletReservationPickerProps) => {
  const todayTimestamp = getTodayTimestamp();

  const initialTimestamp = useMemo(() => {
    if (defaultSelectedSchedule) {
      return parseDateKey(defaultSelectedSchedule.date);
    }

    return todayTimestamp;
  }, [defaultSelectedSchedule, todayTimestamp]);

  const [selectedTimestamp, setSelectedTimestamp] = useState(initialTimestamp);
  const [selectedYearAndMonth, setSelectedYearAndMonth] = useState(() =>
    getYearAndMonthFromTimestamp(initialTimestamp),
  );
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    defaultSelectedSchedule?.scheduleId ?? null,
  );
  const [headCount, setHeadCount] = useState(defaultHeadCount);

  const { availableSchedules, isLoading } = useAvailableReservationSchedules(
    activityId,
    selectedYearAndMonth,
  );
  const availableDateKeys = useMemo(
    () => availableSchedules.map((schedule) => schedule.date),
    [availableSchedules],
  );
  const selectableDateKeys = useMemo(
    () => getSelectableDateKeys(availableDateKeys),
    [availableDateKeys],
  );

  const selectedDateKey = formatDateKey(selectedTimestamp);

  const availableTimes = useMemo(
    () =>
      availableSchedules.find((schedule) => schedule.date === selectedDateKey)
        ?.times ?? [],
    [availableSchedules, selectedDateKey],
  );

  useEffect(() => {
    setSelectedYearAndMonth(getYearAndMonthFromTimestamp(selectedTimestamp));
  }, [selectedTimestamp]);

  useEffect(() => {
    if (availableTimes.length === 0) {
      setSelectedScheduleId(null);
      return;
    }

    if (
      selectedScheduleId !== null &&
      !availableTimes.some((time) => time.id === selectedScheduleId)
    ) {
      setSelectedScheduleId(null);
    }
  }, [availableTimes, selectedScheduleId]);

  useEffect(() => {
    if (defaultSelectedSchedule || selectableDateKeys.has(selectedDateKey)) {
      return;
    }

    const firstAvailableDateKey = Array.from(selectableDateKeys).sort()[0];
    if (firstAvailableDateKey) {
      setSelectedTimestamp(parseDateKey(firstAvailableDateKey));
    }
  }, [defaultSelectedSchedule, selectableDateKeys, selectedDateKey]);

  const isConfirmable = selectedScheduleId !== null;

  const handleSelectTimestamp = (timestamp: number) => {
    setSelectedTimestamp(timestamp);
    setSelectedScheduleId(null);
  };

  const handleDecreaseHeadCount = () => {
    setHeadCount((prev) => Math.max(MIN_HEAD_COUNT, prev - 1));
  };

  const handleIncreaseHeadCount = () => {
    setHeadCount((prev) => Math.min(MAX_HEAD_COUNT, prev + 1));
  };

  const handleConfirmClick = () => {
    if (!selectedScheduleId) {
      return;
    }

    const selectedTime = availableTimes.find(
      (time) => time.id === selectedScheduleId,
    );

    if (!selectedTime) {
      return;
    }

    onConfirm({
      schedule: {
        scheduleId: selectedTime.id,
        date: selectedDateKey,
        startTime: selectedTime.startTime,
        endTime: selectedTime.endTime,
      },
      headCount,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-20-bold text-gray-950">날짜</h3>
      <div className="flex gap-6 pb-4">
        <div className="flex-1">
          <Calendar
            selectedTimestamp={new Set([selectedTimestamp])}
            selectedYearAndMonth={selectedYearAndMonth}
            selectableDateKeys={selectableDateKeys}
            onSelectTimestamp={handleSelectTimestamp}
            onChangeYearAndMonth={setSelectedYearAndMonth}
          />
        </div>

        <div className="flex w-75 flex-col gap-9 rounded-3xl px-6 py-7.5 shadow-[0_4px_24px_0_rgba(156,180,202,0.2)]">
          <div className="flex flex-col gap-5">
            <h3 className="text-16-bold text-gray-950">예약 가능한 시간</h3>
            <div className="flex flex-col gap-3">
              {isLoading ? (
                <Skeleton className="h-12.75 w-full rounded-xl" />
              ) : availableTimes.length === 0 ? (
                <div className="relative flex h-12.75 w-full items-center justify-center">
                  <Search className="absolute top-1/2 left-1/2 z-0 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-gray-100" />
                  <span className="text-16-medium z-1 text-gray-950">
                    예약 가능한 시간이 없습니다.
                  </span>
                </div>
              ) : (
                availableTimes.map((time) => (
                  <button
                    key={time.id}
                    type="button"
                    onClick={() => setSelectedScheduleId(time.id)}
                    className={`text-14-medium rounded-xl border px-3 py-3.5 transition ${
                      selectedScheduleId === time.id
                        ? "ring-primary-500 border-primary-500 bg-primary-100 text-primary-500 ring-2 ring-inset"
                        : "hover:border-primary-500 border-gray-300 bg-white text-gray-900"
                    }`}
                  >
                    {time.startTime} ~ {time.endTime}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="text-16-bold text-gray-950">참여 인원 수</h3>
            <div className="flex items-center justify-between rounded-xl border border-gray-100 px-5">
              <button
                type="button"
                aria-label="인원 감소"
                disabled={headCount <= MIN_HEAD_COUNT}
                onClick={handleDecreaseHeadCount}
                className="flex h-10 w-10 items-center justify-center disabled:opacity-40"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="text-16-bold flex h-10 w-10 items-center justify-center text-center text-gray-800">
                {headCount}
              </span>
              <button
                type="button"
                aria-label="인원 증가"
                disabled={headCount >= MAX_HEAD_COUNT}
                onClick={handleIncreaseHeadCount}
                className="flex h-10 w-10 items-center justify-center disabled:opacity-40"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="mainBlue"
        height="h50"
        disabled={!isConfirmable}
        onClick={handleConfirmClick}
      >
        확인
      </Button>
    </div>
  );
};

export default TabletReservationPicker;
