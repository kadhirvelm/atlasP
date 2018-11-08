import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Checkbox, Icon, Tooltip } from "@blueprintjs/core";

import IStoreState from "../../../../State/IStoreState";
import { AddGraphFilter, RemoveGraphFilter } from "../../../../State/WebsiteActions";
import { IFilter } from "../../../../Types/Graph";
import { DATE_FILTERS } from "./FilterConstants";

import "./Filters.scss";

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
            <Tooltip className="filters-date-tooltip" content={this.getDateFiltersHelper()}>
                <Icon icon="help" iconSize={12} />
            </Tooltip>
        )
    }

    private getDateFiltersHelper() {
        return (
            <div className="filters-date-helper">
                When was the last time you saw this person?
                <div className="filters-date-helper-container">
                    <div className="filters-date-helper-single-row">
                        <div className="filters-date-helper-single-row-title">
                            Blue
                        </div>
                        <div className="filters-date-line blue" />
                        <div className="filters-date-helper-single-row-description">
                            In an upcoming event
                        </div>
                    </div>
                    <div className="filters-date-helper-single-row">
                        <div className="filters-date-helper-single-row-title">
                            Green
                        </div>
                        <div className="filters-date-line green" />
                        <div className="filters-date-helper-single-row-description">
                            Less than 30 days
                        </div>
                    </div>
                    <div className="filters-date-helper-single-row">
                        <div className="filters-date-helper-single-row-title">
                            Yellow
                        </div>
                        <div className="filters-date-line green yellow" />
                        <div className="filters-date-helper-single-row-description">
                            Between 30 and 90 days
                        </div>
                    </div>
                    <div className="filters-date-helper-single-row">
                        <div className="filters-date-helper-single-row-title">
                            Red
                        </div>
                        <div className="filters-date-line green red" />
                        <div className="filters-date-helper-single-row-description">
                            More than 90 days
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    private renderDateFilterButtons() {
        return (
            <div className="filters-date-checkboxes">
                {DATE_FILTERS.map(this.renderSingleDateFilter)}
            </div>
        )
    }

    private renderSingleDateFilter = (filter: IFilter) => {
        return (
            <div className="filters-date-single" key={filter.id}>
                <div className={classNames("filters-box", filter.id)} />
                <Checkbox checked={this.doesNotContainFilter(filter.id)} onChange={this.changeFilter(filter)} />
            </div>
        )
    }

    private changeFilter = (filter: IFilter) => {
        return () => {
            if (!this.doesNotContainFilter(filter.id)) {
                this.props.removeFilter(filter.id);
                return;
            }
            this.props.addFilter(filter);
        }
    }

    private doesNotContainFilter(id: string) {
        return this.props.currentFilters.find((filter) => filter.id === id) === undefined;
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
