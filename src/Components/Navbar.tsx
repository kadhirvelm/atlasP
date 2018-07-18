import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import {
    Alignment,
    Button,
    Intent,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Spinner,
} from "@blueprintjs/core";

import { GoogleDispatcher } from "../Dispatchers/GoogleDispatcher";
import User from "../Helpers/User";
import IStoreState from "../State/IStoreState";
import { AddNewEvent } from "./Dialogs/AddNewEvent";
import { FetchPerson } from "./Dialogs/FetchPerson";

import "./Main.css";

interface INavbarState {
  eventEntryDialogOpen: boolean;
  mainPersonDialogOpen: boolean;
}

export interface INavbarStateProps {
    fetching: boolean;
    googleSheetDataError?: any;
    userData?: { id?: User };
}

export interface INavbarDispatchProps {
    fetchGoogleSheetData(): void;
}

class PureAtlaspNavbar extends React.PureComponent<INavbarStateProps & INavbarDispatchProps, INavbarState> {
    public state = {
        eventEntryDialogOpen: false,
        mainPersonDialogOpen: false,
    };

    public render() {
        return(
            <Navbar className="pt-dark" style={{ zIndex: 10 }}>
                {this.renderLeftButtonGroup()}
                {this.renderRightButtonGroup()}
                {this.maybeRenderNewPersonDialog()}
                {this.renderNewEventDialog()}
            </Navbar>
        );
    }

    private renderLeftButtonGroup() {
        return (
            <NavbarGroup align={Alignment.LEFT}>
                <NavbarHeading> Dinner Table </NavbarHeading>
                <NavbarDivider />
                <Button
                    icon="refresh"
                    onClick={this.props.fetchGoogleSheetData}
                    text="Refresh Data"
                    intent={this.returnIntent()}
                />
                {this.props.fetching && <Spinner className="pt-small" intent={Intent.WARNING} />}
                <Button
                    icon="exchange"
                    onClick={this.handleChangeMainPersonDialog}
                    style={{marginLeft: "10px", marginRight: "10px"}}
                    text="Change User"
                />
                <Button icon="add" onClick={this.handleOpenEventEntryDialog} text="Enter Event" />
            </NavbarGroup>
        );
    }

    private renderRightButtonGroup() {
        return (
            <NavbarGroup align={Alignment.RIGHT}>
                <Button icon="link" text="Google Sheet" onClick={this.openSheet} />
                <Button icon="log-out" onClick={this.handleSignOut} />
            </NavbarGroup>
        );
    }

    private handleChangeMainPersonDialog = () => {
        this.setState({ mainPersonDialogOpen: true });
    }

    private handleMainPersonDialogClose = () => {
        this.setState({ mainPersonDialogOpen: false });
    }

    private handleOpenEventEntryDialog = () => {
        this.setState({ eventEntryDialogOpen: true });
    }

    private handleCloseEventEntryDialog = () => {
        this.setState({ eventEntryDialogOpen: false });
    }

    private openSheet() {
        // tslint:disable-next-line:max-line-length
        window.open("https://docs.google.com/spreadsheets/d/1fsQHaT2ZG1uRKmuHagoUjReNMpFH3_fSGw9HLLcphIg/edit#gid=123656038", "_blank");
    }

    private maybeRenderNewPersonDialog() {
        if (this.props.userData === undefined) {
            return null;
        }
        return (
            <FetchPerson
                handleMainPersonDialogClose={this.handleMainPersonDialogClose}
                mainPersonDialogOpen={this.state.mainPersonDialogOpen}
            />
        );
    }

    private renderNewEventDialog() {
        return (
            <AddNewEvent
                isOpen={this.state.eventEntryDialogOpen}
                onClose={this.handleCloseEventEntryDialog}
            />
        );
    }

    private returnIntent(): Intent {
        return (this.props.userData && Object.keys(this.props.userData).length) ? Intent.NONE : Intent.DANGER;
    }

    private handleSignOut = () => {
        window["gapi"].auth2.getAuthInstance().signOut();
    }
}

function mapStateToProps(state: IStoreState): INavbarStateProps {
  return {
    fetching: state.GoogleReducer.isFetching,
    googleSheetDataError: state.GoogleReducer.googleSheetDataError,
    userData: state.GoogleReducer.userData,
  };
}

function mapDispatchToProps(dispatch: Dispatch): INavbarDispatchProps {
    const googleDispatcher = new GoogleDispatcher(dispatch);
    return {
        fetchGoogleSheetData: googleDispatcher.fetchGoogleSheetData,
    };
}

export const AtlaspNavbar = connect(mapStateToProps, mapDispatchToProps)(PureAtlaspNavbar);
