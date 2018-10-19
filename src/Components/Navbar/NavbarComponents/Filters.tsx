import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Checkbox, Icon, Tooltip } from "@blueprintjs/core";

import IStoreState from "../../../State/IStoreState";
import { AddGraphFilter, RemoveGraphFilter } from "../../../State/WebsiteActions";
import { IFilter } from "../../../Types/Graph";
import { GREEN_FILTER, GREEN_FILTER_ID, RED_FILTER, RED_FILTER_ID, YELLOW_FILTER, YELLOW_FILTER_ID } from "./FilterConstants";

import "./Filters.css";

export interface IFiltersStoreProps {
    currentFilters: IFilter[];
}

export interface IFilterDispatchProps {
    addFilter: (filter: IFilter) => void;
    removeFilter: (filterId: string) => void;
}

class PureFilters extends React.PureComponent<IFiltersStoreProps & IFilterDispatchProps> {
    public render() {
        return (
            <div className="filters-container">
                <div className="filters-last-seen">
                    Last Seen
                    {this.renderHelperTooltip()}
                </div>
                {this.renderDateFilterButtons()}
            </div>
        )
    }

    private renderHelperTooltip() {
        return (
            <Tooltip className="filters-date-tooltip" content="Green - 30 days, Yellow - 30 to 90 days, Red - 90+ days">
                <Icon icon="help" iconSize={12} />
            </Tooltip>
        )
    }

    private renderDateFilterButtons() {
        return (
            <div className="filters-date-checkboxes">
                <div className="filters-box green" />
                <Checkbox checked={this.containsFilter(GREEN_FILTER_ID)} onChange={this.changeFilter(GREEN_FILTER_ID)} />
                <div className="filters-box yellow" />
                <Checkbox checked={this.containsFilter(YELLOW_FILTER_ID)} onChange={this.changeFilter(YELLOW_FILTER_ID)} />
                <div className="filters-box red" />
                <Checkbox checked={this.containsFilter(RED_FILTER_ID)} onChange={this.changeFilter(RED_FILTER_ID)} />
            </div>
        )
    }

    private changeFilter = (id: string) => {
        return () => {
            if (this.containsFilter(id)) {
                this.props.removeFilter(id);
                return;
            }
            const finalFilter = this.getFilter(id);
            if (finalFilter === undefined) {
                return;
            }
            this.props.addFilter(finalFilter);
        }
    }

    private getFilter(id: string) {
        switch (id) {
            case GREEN_FILTER_ID:
                return GREEN_FILTER;
            case YELLOW_FILTER_ID:
                return YELLOW_FILTER;
            case RED_FILTER_ID:
                return RED_FILTER;
        }
        return undefined;
    }

    private containsFilter(id: string) {
        return this.props.currentFilters.find((filter) => filter.id === id) !== undefined;
    }
}

function mapStateToProps(state: IStoreState): IFiltersStoreProps {
    return {
        currentFilters: state.WebsiteReducer.graphFilters,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IFilterDispatchProps {
    return bindActionCreators({ addFilter: AddGraphFilter.create, removeFilter: RemoveGraphFilter.create }, dispatch)
}

export const Filters = connect(mapStateToProps, mapDispatchToProps)(PureFilters);
