import * as React from "react";
import { connect } from "react-redux";

import { Button } from "@blueprintjs/core";

import IStoreState from "../../State/IStoreState";
import { IUser, IUserMap } from "../../Types/Users";
import { Autocomplete } from "../Common/Autocomplete";
import { zoomByScale } from "./DisplayGraphUtils";

import "./DisplayGraphHelpers.css";

export interface IDisplayGraphHelpersProps {
    zoomToNode(node: IUser): void;
}

export interface IDisplayGraphHelpersStoreProps {
    userMap: IUserMap | undefined;
}

class PureDisplayGraphHelpers extends React.PureComponent<IDisplayGraphHelpersProps & IDisplayGraphHelpersStoreProps> {
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
                <div className="graph-assistant-buttons">
                    <Button
                        className="zoom-in-button"
                        icon="zoom-in"
                        onClick={this.handleZoomIn}
                    />
                    <Button
                        className="zoom-in-button"
                        icon="zoom-out"
                        onClick={this.handleZoomOut}
                    />
                </div>
            </div>
        )
    }

    private handleZoomIn = () => zoomByScale(1.25);
    private handleZoomOut = () => zoomByScale(0.75);
}

function mapStoreToProps(state: IStoreState): IDisplayGraphHelpersStoreProps {
    return {
        userMap: state.DatabaseReducer.userData,
    }
}

export const DisplayGraphHelpers = connect(mapStoreToProps)(PureDisplayGraphHelpers);
