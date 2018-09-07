import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

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
import { AddNewPerson } from "./Dialogs/AddNewUser";
import { FetchPerson } from "./Dialogs/FetchPerson";

import { EmptyDatabaseCache } from "../State/DatabaseActions";
import "./Main.css";
import "./Navbar.css";

interface INavbarState {
  eventEntryDialogOpen: boolean;
  mainPersonDialogOpen: boolean;
  personEntryDialogOpen: boolean;
}

export interface INavbarStateProps {
    currentUser?: any;
    fetching: boolean;
    googleSheetDataError?: any;
    isAdmin: boolean;
    userData?: { id?: User };
}

export interface INavbarDispatchProps {
    fetchGoogleSheetData(): void;
    signOut(): void;
}

class PureAtlaspNavbar extends React.PureComponent<INavbarStateProps & INavbarDispatchProps, INavbarState> {
    public state = {
        eventEntryDialogOpen: false,
        mainPersonDialogOpen: false,
        personEntryDialogOpen: false,
    };

    public render() {
        return(
            <Navbar className="pt-dark" style={{ zIndex: 10 }}>
                {this.renderLeftButtonGroup()}
                {this.renderRightButtonGroup()}
                {this.renderNewEventDialog()}
                {this.renderNewPersonDialog()}
            </Navbar>
        );
    }

    private renderLeftButtonGroup() {
        return (
            <NavbarGroup align={Alignment.LEFT}>
                <NavbarHeading> AtlasP </NavbarHeading>
                <NavbarDivider />
                <Button
                    className="navbar-button"
                    icon="refresh"
                    onClick={this.props.fetchGoogleSheetData}
                    text="Refresh Data"
                    intent={this.returnIntent()}
                />
                {this.maybeRenderOtherLeftOptions()}
            </NavbarGroup>
        );
    }

    private maybeRenderOtherLeftOptions() {
        if (this.props.userData === undefined) {
            return null;
        }
        return (
            <div style={ { display: "flex" } }>
                {this.maybeRenderSpinner()}
                <Button className="navbar-button" icon="add" onClick={this.handleOpenEventEntryDialog} text="Enter Event" />
                <Button className="navbar-button" icon="new-person" onClick={this.handleOpenPersonEntryDialog} text="Add Person" />
                {this.renderAdminOptions()}
            </div>
        )
    }

    private maybeRenderSpinner() {
        if (!this.props.fetching) {
            return null;
        }
        return <Spinner className="pt-small" intent={Intent.WARNING} />
    }

    private renderAdminOptions() {
        if (!this.props.isAdmin) {
            return null;
        }
        return (
            <div>
                <Button
                    className="navbar-button"
                    icon="exchange"
                    onClick={this.handleChangeMainPersonDialog}
                    text="Change User"
                />
                <Button className="navbar-button" icon="link" text="Google Sheet" onClick={this.openSheet} />
                {this.maybeRenderFetchPersonDialog()}
            </div>
        )
    }

    private renderRightButtonGroup() {
        return (
            <NavbarGroup align={Alignment.RIGHT}>
                {this.maybeRenderUsername()}
                <Button icon="log-out" onClick={this.handleSignOut} />
            </NavbarGroup>
        );
    }

    private maybeRenderUsername() {
        if (this.props.currentUser === undefined) {
            return null;
        }
        return <div style={ { marginRight: "10px" } }>{this.props.currentUser.ig}</div>;
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

    private handleOpenPersonEntryDialog = () => {
        this.setState({ personEntryDialogOpen: true });
    }

    private handleClosePersonEntryDialog = () => {
        this.setState({ personEntryDialogOpen: false });
    }

    private openSheet() {
        // tslint:disable-next-line:max-line-length
        window.open(`https://docs.google.com/spreadsheets/d/${process.env.REACT_APP_SPREADSHEET}`, "_blank");
    }

    private maybeRenderFetchPersonDialog() {
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

    private renderNewPersonDialog() {
        return (
            <AddNewPerson
                isOpen={this.state.personEntryDialogOpen}
                onClose={this.handleClosePersonEntryDialog}
            />
        )
    }

    private returnIntent(): Intent {
        return (this.props.userData && Object.keys(this.props.userData).length) ? Intent.NONE : Intent.DANGER;
    }

    private handleSignOut = () => {
        this.props.signOut();
    }
}

function mapStateToProps(state: IStoreState): INavbarStateProps {
  return {
    currentUser: state.GoogleReducer.currentUser,
    fetching: state.GoogleReducer.isFetching,
    googleSheetDataError: state.GoogleReducer.googleSheetDataError,
    isAdmin: state.GoogleReducer.isAdmin || false,
    userData: state.GoogleReducer.userData,
  };
}

function mapDispatchToProps(dispatch: Dispatch): INavbarDispatchProps {
    const googleDispatcher = new GoogleDispatcher(dispatch);
    return {
        fetchGoogleSheetData: googleDispatcher.fetchGoogleSheetData,
        ...bindActionCreators({ signOut: EmptyDatabaseCache.create }, dispatch),
    };
}

export const AtlaspNavbar = connect(mapStateToProps, mapDispatchToProps)(PureAtlaspNavbar);
