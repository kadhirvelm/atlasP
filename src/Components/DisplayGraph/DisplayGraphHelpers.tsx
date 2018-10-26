import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Button } from "@blueprintjs/core";

import IStoreState from "../../State/IStoreState";
import { RemoveAllHighlights } from "../../State/WebsiteActions";
import { IUser, IUserMap } from "../../Types/Users";
import { Autocomplete } from "../Common/Autocomplete";
import { zoomByScale } from "./DisplayGraphUtils";

import "./DisplayGraphHelpers.css";

export interface IDisplayGraphHelpersProps {
    zoomToNode(node: IUser): void;
}

export interface IDisplayGraphHelpersDispatchProps {
    removeAllHighlights(): void;
}

export interface IDisplayGraphHelpersStoreProps {
    userMap: IUserMap | undefined;
}

class PureDisplayGraphHelpers extends React.PureComponent<IDisplayGraphHelpersProps & IDisplayGraphHelpersDispatchProps & IDisplayGraphHelpersStoreProps> {
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
                        title="Zoom in"
                        icon="zoom-in"
                        onClick={this.handleZoomIn}
                    />
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
            </div>
        )
    }

    private handleZoomIn = () => zoomByScale(1.25);
    private handleZoomOut = () => zoomByScale(0.75);

    private removeAllHighlights = () => this.props.removeAllHighlights();
}

function mapStoreToProps(state: IStoreState): IDisplayGraphHelpersStoreProps {
    return {
        userMap: state.DatabaseReducer.userData,
    }
}

function mapDispatchToProps(dispatch: Dispatch): IDisplayGraphHelpersDispatchProps {
    return bindActionCreators({
        removeAllHighlights: RemoveAllHighlights.create,
    }, dispatch);
}

export const DisplayGraphHelpers = connect(mapStoreToProps, mapDispatchToProps)(PureDisplayGraphHelpers);
