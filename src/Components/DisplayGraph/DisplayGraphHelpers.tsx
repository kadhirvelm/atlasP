import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Button, Tooltip } from "@blueprintjs/core";

import { GraphIcon } from "../../icons/graphIcon";
import IStoreState from "../../State/IStoreState";
import { RemoveAllHighlights } from "../../State/WebsiteActions";
import { IGraphType } from "../../Types/Graph";
import { IUser } from "../../Types/Users";
import { selectGraphHealth } from "../../Utils/selectors";
import { Autocomplete } from "../Common/Autocomplete";
import { zoomByScale } from "./DisplayGraphUtils";

import "./DisplayGraphHelpers.scss";

export interface IDisplayGraphHelpersProps {
  zoomToNode(node: IUser): void;
}

export interface IDisplayGraphHelpersDispatchProps {
  removeAllHighlights(): void;
}

export interface IDisplayGraphHelpersStoreProps {
  graphType: IGraphType;
  health: number | undefined;
  userMap: Map<string, IUser> | undefined;
}

class PureDisplayGraphHelpers extends React.PureComponent<
  IDisplayGraphHelpersProps &
    IDisplayGraphHelpersDispatchProps &
    IDisplayGraphHelpersStoreProps
> {
  public render() {
    return (
      <div className="graph-helpers">
        <Autocomplete
          className="find-user-autocomplete"
          dataSource={this.props.userMap}
          displayKey="name"
          placeholderText="Search for user…"
          onSelection={this.props.zoomToNode}
        />
        <div className="graph-helpers-bottom-container">
          <div className="graph-helpers-single-row">
            {this.renderHealth()}
            {this.renderGraphLabel()}
          </div>
          <div className="graph-helpers-single-row">
            {this.renderGraphHelperButtons()}
          </div>
        </div>
      </div>
    );
  }

  private renderHealth() {
    const { health } = this.props;
    if (health === undefined) {
      return null;
    }
    return (
      <div
        className={classNames("display-graph-health", {
          green: health >= 75,
          red: health < 50,
          yellow: health < 75 && health >= 50
        })}
      >
        <Tooltip content={this.getHealthTooltipContent()} position="left">
          {this.props.health}
        </Tooltip>
      </div>
    );
  }

  private getHealthTooltipContent() {
    return (
      <div className="graph-helpers-tooltip">
        Your graph health. Use this to gauge your current work life balance.
        <div className="graph-helper-math-box">
          This number reflects how in touch you are in with your friends.
        </div>
      </div>
    );
  }

  private renderGraphLabel() {
    return (
      <>
        <Tooltip content={this.props.graphType.tooltip} hoverOpenDelay={500}>
          <div
            className={classNames("graph-label", "show-change")}
            key={this.props.graphType.id}
          >
            <GraphIcon
              attributes={{
                height: 15,
                style: {
                  fill: "white",
                  marginRight: "5px",
                  minHeight: 15,
                  minWidth: 15,
                  stroke: "white"
                },
                width: 15
              }}
            />
            {this.props.graphType.id}
          </div>
        </Tooltip>
      </>
    );
  }

  private renderGraphHelperButtons() {
    return (
      <>
        <div className="graph-assistant-buttons">
          <Button title="Zoom in" icon="zoom-in" onClick={this.handleZoomIn} />
          <Button
            title="Zoom out"
            icon="zoom-out"
            onClick={this.handleZoomOut}
          />
          <Button
            title="Remove highlights"
            icon="delete"
            onClick={this.removeAllHighlights}
          />
        </div>
      </>
    );
  }

  private handleZoomIn = () => zoomByScale(1.25);
  private handleZoomOut = () => zoomByScale(0.75);

  private removeAllHighlights = () => this.props.removeAllHighlights();
}

function mapStoreToProps(state: IStoreState): IDisplayGraphHelpersStoreProps {
  return {
    graphType: state.WebsiteReducer.graphType,
    health: selectGraphHealth(state),
    userMap: state.DatabaseReducer.userData
  };
}

function mapDispatchToProps(
  dispatch: Dispatch
): IDisplayGraphHelpersDispatchProps {
  return bindActionCreators(
    {
      removeAllHighlights: RemoveAllHighlights.create
    },
    dispatch
  );
}

export const DisplayGraphHelpers = connect(
  mapStoreToProps,
  mapDispatchToProps
)(PureDisplayGraphHelpers);
