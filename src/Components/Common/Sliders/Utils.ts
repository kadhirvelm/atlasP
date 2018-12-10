import { IRangeSliderValue } from "./RangeSlider";

export const DEFAULT_FREQUENCY_DAYS = 30;

export const FREQUENCIES: Array<{ label: string; value: number | "IGNORE" }> = [
  { label: "1 week", value: 7 },
  { label: "2 weeks", value: 14 },
  { label: "3 weeks", value: 21 },
  { label: "1 month", value: 30 },
  { label: "6 weeks", value: 45 },
  { label: "2 months", value: 60 },
  { label: "3 months", value: 90 },
  { label: "4 months", value: 120 },
  { label: "5 months", value: 150 },
  { label: "6 months", value: 180 },
  { label: "9 months", value: 270 },
  { label: "1 year", value: 365 },
  { label: "Ignore", value: "IGNORE" }
];

export const getInitialRangeValue = (
  initialValue: IRangeSliderValue | undefined
): [number, number] => {
  if (initialValue === undefined) {
    return [0, FREQUENCIES.length - 1];
  }

  return initialValue.map(getInitialValue) as [number, number];
};

export const getInitialValue = (
  initialValue: number | "IGNORE" | undefined
) => {
  const foundValue = FREQUENCIES.findIndex(
    item => item.value === (initialValue || DEFAULT_FREQUENCY_DAYS)
  );
  return foundValue === -1 ? 3 : foundValue;
};

export const handleLabel = (value: number) => {
  const frequencyLabel = FREQUENCIES[value];
  return frequencyLabel === undefined ? "Unknown" : frequencyLabel.label;
};
