export interface YearAndMonth {
  year: number;
  month: number;
}

export interface SelectedSchedule {
  scheduleId: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface ReservationProps {
  activityId: number;
  price: number;
  className?: string;
  showPrice?: boolean;
  showHeadCount?: boolean;
  showTotalPrice?: boolean;
  submitLabel?: string;
  defaultSelectedSchedule?: SelectedSchedule | null;
  onReserve?: (payload: { scheduleId: number; headCount: number }) => void;
  onScheduleSelect?: (schedule: SelectedSchedule) => void;
}

export interface HeadCountSelectorProps {
  headCount: number;
  onHeadCountChange: (headCount: number) => void;
  onConfirm?: (headCount: number) => void;
  onBackButtonClick: () => void;
  className?: string;
}

export interface TabletReservationPickerProps {
  activityId: number;
  defaultSelectedSchedule?: SelectedSchedule | null;
  defaultHeadCount?: number;
  onConfirm: (payload: {
    schedule: SelectedSchedule;
    headCount: number;
  }) => void;
}

export interface CalendarProps {
  selectedTimestamps: Set<number>;
  selectedYearAndMonth: YearAndMonth;
  selectableDateKeys: Set<string>;
  onSelectTimestamp: (timestamp: number) => void;
  onChangeYearAndMonth: (nextMonth: YearAndMonth) => void;
}
