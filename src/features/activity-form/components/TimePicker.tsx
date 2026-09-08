import { ReactNode } from "react";
import SelectDropdown from "@/components/SelectDropdown/SelectDropdown";
import { TIME_OPTIONS } from "@/features/activity-form/utils";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string | ReactNode;
  minTime?: string;
  includeMidnight?: boolean;
}

const MIDNIGHT_OPTION = { value: "24:00", label: "24:00" };

const TimePicker = ({
  value,
  onChange,
  label,
  minTime,
  includeMidnight,
}: TimePickerProps) => {
  const base = includeMidnight
    ? [...TIME_OPTIONS, MIDNIGHT_OPTION]
    : TIME_OPTIONS;

  const options = minTime
    ? base.filter((option) => option.value > minTime)
    : base;

  return (
    <SelectDropdown
      options={options}
      selectedValue={value}
      onChange={(val) => onChange(String(val))}
      placeholder="00:00"
      fieldLabel={label}
    />
  );
};

export { TimePicker };
