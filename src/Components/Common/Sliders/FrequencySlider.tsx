import classNames from "classnames";
import * as React from "react";

import { Slider } from "@blueprintjs/core";

import "./Slider.scss";
import { FREQUENCIES, getInitialValue, handleLabel } from "./Utils";

export interface IFrequencySliderProps {
  className?: string;
  disabled?: boolean;
  initialValue?: number | "IGNORE";
  onChange?(value: number | string): void;
}

export interface IFrequencySliderState {
  value: number;
}

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
          disabled={this.props.disabled}
          labelRenderer={handleLabel}
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
}
