import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Checkbox, Icon, Tooltip } from "@blueprintjs/core";

import IStoreState from "../../../../State/IStoreState";
import {
  AddGraphFilter,
  RemoveGraphFilter
} from "../../../../State/WebsiteActions";
import { IFilter } from "../../../../Types/Graph";
import { DATE_FILTERS, IGNORE_FILTER } from "./FilterConstants";
import { getDateFiltersHelper, getIgnoreListHelper } from "./FiltersUtils";

import "./Filters.scss";

export interface IFiltersStoreProps {
  currentFilters: IFilter[];
}

export interface IFilterDispatchProps {
  addFilter: (filter: IFilter) => void;
  removeFilter: (filterId: string) => void;
}

class PureFilters extends React.PureComponent<
  IFiltersStoreProps & IFilterDispatchProps
> {
  public render() {
    return (
      <div className="filters-container">
        <div className="filters-last-seen">
          Last Seen
          {this.renderLastSeenTooltip(getDateFiltersHelper)}
        </div>
        {this.renderDateFilterButtons()}
        <div className="filters-people">
          Relationships
          {this.renderLastSeenTooltip(getIgnoreListHelper)}
        </div>
        {this.renderIgnoreFilter()}
      </div>
    );
  }

  private renderLastSeenTooltip(content: JSX.Element) {
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

  private renderIgnoreFilter() {
    return (
      <div className="filters-ignore-users" key={IGNORE_FILTER.id}>
        <Icon
          className="filter-ignore-users-icon"
          icon="blocked-person"
          iconSize={25}
        />
        <Checkbox
          checked={!this.doesContainFilter(IGNORE_FILTER.id)}
          onChange={this.changeFilter(IGNORE_FILTER)}
        />
      </div>
    );
  }

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
    currentFilters: state.WebsiteReducer.graphFilters
  };
}

function mapDispatchToProps(dispatch: Dispatch): IFilterDispatchProps {
  return bindActionCreators(
    {
      addFilter: AddGraphFilter.create,
      removeFilter: RemoveGraphFilter.create
    },
    dispatch
  );
}

export const Filters = connect(
  mapStateToProps,
  mapDispatchToProps
)(PureFilters);
