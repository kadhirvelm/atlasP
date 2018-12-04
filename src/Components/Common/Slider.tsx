import classNames from "classnames";
import * as React from "react";

import { Slider } from "@blueprintjs/core";

import "./Slider.scss";

export interface IFrequencySliderProps {
  className?: string;
  initialValue?: number | "IGNORE";
  onChange?(value: number | string): void;
}

export interface IFrequencySliderState {
  value: number;
}

export const DEFAULT_FREQUENCY_DAYS = 30;

const FREQUENCIES: Array<{ label: string; value: number | string }> = [
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

const getInitialValue = (initialValue: number | "IGNORE" | undefined) => {
  const foundValue = FREQUENCIES.findIndex(
    item => item.value === (initialValue || DEFAULT_FREQUENCY_DAYS)
  );
  return foundValue === -1 ? 3 : foundValue;
};

export class FrequencySlider extends React.PureComponent<
  IFrequencySliderProps,
  IFrequencySliderState
> {
  public state: IFrequencySliderState = {
    value: getInitialValue(this.props.initialValue)
  };

  public render() {
    return (
      <div className={classNames(this.props.className, "slider")}>
        <Slider
          labelRenderer={this.handleLabel}
          labelStepSize={3}
          min={0}
          max={FREQUENCIES.length - 1}
          onChange={this.handleChange}
          onRelease={this.handleRelease}
          value={this.state.value}
        />
      </div>
    );
  }

  private handleChange = (value: number) => this.setState({ value });

  private handleRelease = (value: number) => {
    if (this.props.onChange === undefined) {
      return;
    }
    this.props.onChange(FREQUENCIES[value].value);
  };

  private handleLabel = (value: number) => {
    const frequencyLabel = FREQUENCIES[value];
    return frequencyLabel === undefined
      ? this.state.value.toString()
      : frequencyLabel.label;
  };
}
