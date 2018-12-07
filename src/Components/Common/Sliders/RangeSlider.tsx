import classNames from "classnames";
import * as React from "react";

import { RangeSlider } from "@blueprintjs/core";

import { FREQUENCIES, getInitialRangeValue, handleLabel } from "./Utils";

import "./Slider.scss";

export type IRangeSliderValue = [number | "IGNORE", number | "IGNORE"];

export interface IFrequencySliderProps {
  className?: string;
  initialValue?: IRangeSliderValue;
  vertical?: boolean;
  onChange?(value: IRangeSliderValue): void;
}

export interface IFrequencyRangeSliderState {
  value: [number, number];
}

export class FrequencyRangeSlider extends React.PureComponent<
  IFrequencySliderProps,
  IFrequencyRangeSliderState
> {
  public state: IFrequencyRangeSliderState = {
    value: getInitialRangeValue(this.props.initialValue)
  };

  public render() {
    return (
      <div className={classNames(this.props.className, "slider")}>
        <RangeSlider
          labelRenderer={handleLabel}
          labelStepSize={FREQUENCIES.length}
          min={0}
          max={FREQUENCIES.length - 1}
          onChange={this.handleChange}
          onRelease={this.handleRelease}
          value={this.state.value}
          vertical={this.props.vertical}
        />
      </div>
    );
  }

  private handleChange = (value: [number, number]) => this.setState({ value });

  private handleRelease = (value: [number, number]) => {
    if (this.props.onChange === undefined) {
      return;
    }
    const mapValue = (index: number) => FREQUENCIES[index].value;
    this.props.onChange(value.map(mapValue) as [
      number | "IGNORE",
      number | "IGNORE"
    ]);
  };
}
