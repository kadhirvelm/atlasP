import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Checkbox, Icon, Tooltip } from "@blueprintjs/core";

import IStoreState from "../../../../State/IStoreState";
import {
  AddGraphFilter,
  RemoveGraphFilter,
  SetRangeFilter
} from "../../../../State/WebsiteActions";
import { IFilter } from "../../../../Types/Graph";
import {
  FrequencyRangeSlider,
  IRangeSliderValue
} from "../../../Common/Sliders/RangeSlider";
import { DATE_FILTERS, RANGE_BOUND_FREQUENCY_FILTER } from "./FilterConstants";
import {
  getDateFiltersHelper,
  getFrequencyFiltersHelpers
} from "./FiltersUtils";

import "./Filters.scss";

export interface IFiltersStoreProps {
  currentFilters: IFilter[];
  isPremium: boolean;
  rangeFilterValue: IRangeSliderValue | undefined;
}

export interface IFilterDispatchProps {
  addFilter: (filter: IFilter) => void;
  removeFilter: (filterId: string) => void;
  setRangeFilter: (rangeFilter: IRangeSliderValue) => void;
}

class PureFilters extends React.PureComponent<
  IFiltersStoreProps & IFilterDispatchProps
> {
  public render() {
    return (
      <div className="filters-container">
        <div className="filters-last-seen">
          Last Seen
          {this.renderHelperTooltip(getDateFiltersHelper)}
        </div>
        {this.renderDateFilterButtons()}
        {this.maybeRenderIgnoreFilter()}
      </div>
    );
  }

  private renderHelperTooltip(content: JSX.Element) {
    return (
      <Tooltip className="filters-date-tooltip" content={content}>
        <Icon icon="help" iconSize={12} />
      </Tooltip>
    );
  }

  private renderDateFilterButtons() {
    return (
      <div className="filters-date-checkboxes">
        {DATE_FILTERS.map(this.renderSingleDateFilter)}
      </div>
    );
  }

  private renderSingleDateFilter = (filter: IFilter) => {
    return (
      <div className="filters-date-single" key={filter.id}>
        <div className={classNames("filters-box", filter.id)} />
        <Checkbox
          checked={!this.doesContainFilter(filter.id)}
          onChange={this.changeFilter(filter)}
        />
      </div>
    );
  };

  private maybeRenderIgnoreFilter() {
    if (!this.props.isPremium) {
      return null;
    }

    return (
      <>
        <div className="filters-people">
          Frequency
          {this.renderHelperTooltip(getFrequencyFiltersHelpers)}
        </div>
        <div className="filters-categories">
          <FrequencyRangeSlider
            className="filters-frequency-range-slider"
            initialValue={this.props.rangeFilterValue}
            onChange={this.frequencyFilterChange}
            vertical={true}
          />
        </div>
      </>
    );
  }

  private frequencyFilterChange = (value: IRangeSliderValue) => {
    const newFilter = RANGE_BOUND_FREQUENCY_FILTER(value);
    this.props.removeFilter(newFilter.id);
    this.props.addFilter(newFilter);
    this.props.setRangeFilter(value);
  };

  private changeFilter = (filter: IFilter) => {
    return () => {
      if (this.doesContainFilter(filter.id)) {
        this.props.removeFilter(filter.id);
        return;
      }
      this.props.addFilter(filter);
    };
  };

  private doesContainFilter(id: string) {
    return (
      this.props.currentFilters.find(filter => filter.id === id) !== undefined
    );
  }
}

function mapStateToProps(state: IStoreState): IFiltersStoreProps {
  return {
    currentFilters: state.WebsiteReducer.graphFilters,
    isPremium: state.DatabaseReducer.isPremium,
    rangeFilterValue: state.WebsiteReducer.rangeFilter
  };
}

function mapDispatchToProps(dispatch: Dispatch): IFilterDispatchProps {
  return bindActionCreators(
    {
      addFilter: AddGraphFilter.create,
      removeFilter: RemoveGraphFilter.create,
      setRangeFilter: SetRangeFilter.create
    },
    dispatch
  );
}

export const Filters = connect(
  mapStateToProps,
  mapDispatchToProps
)(PureFilters);
