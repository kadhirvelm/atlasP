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
import { AddNewPerson } from "./Dialogs/AddNewUser";
import { DialogWrapper } from "./Dialogs/DialogWrapper";
import { FetchPerson } from "./Dialogs/FetchPerson";

import "./Main.css";
import "./Navbar.css";

interface INavbarState {
  eventEntryDialogOpen: boolean;
  mainPersonDialogOpen: boolean;
  personEntryDialogOpen: boolean;
}

export interface INavbarProps {
    mobile?: boolean;
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

class PureAtlaspNavbar extends React.PureComponent<INavbarProps & INavbarStateProps & INavbarDispatchProps, INavbarState> {
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
                    text={this.maybeRenderText()}
                    intent={this.returnIntent()}
                />
                {this.maybeRenderSpinner()}
                {this.maybeRenderOtherLeftButtons()}
            </NavbarGroup>
        );
    }

    private maybeRenderText() {
        if (this.props.mobile) {
            return undefined;
        }
        return "Refresh Data";
    }

    private maybeRenderSpinner() {
        if (!this.props.fetching) {
            return null;
        }
        return <Spinner className="pt-small" intent={Intent.WARNING} />
    }

    private maybeRenderOtherLeftButtons() {
        if (this.props.mobile || this.props.userData === undefined) {
            return undefined;
        }
        return (
            <div className="flexrow">
                <DialogWrapper className="navbar-button" dialog={AddNewEvent} icon="add" text="Enter Event" />
                <DialogWrapper className="navbar-button" dialog={AddNewPerson} icon="new-person" text="Add Person" />
                {this.maybeRenderAdminOptions()}
            </div>
        )
    }

    private maybeRenderAdminOptions() {
        if (!this.props.isAdmin) {
            return null;
        }
        return (
            <div className="flexrow">
                <DialogWrapper className="navbar-button" dialog={FetchPerson} icon="exchange" text="Change User" />
                <Button className="navbar-button" icon="link" text="Google Sheet" onClick={this.openSheet} />
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

    private openSheet() {
        // tslint:disable-next-line:max-line-length
        window.open(`https://docs.google.com/spreadsheets/d/${process.env.REACT_APP_SPREADSHEET}`, "_blank");
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
        signOut: googleDispatcher.signOut,
    };
}

export const AtlaspNavbar = connect(mapStateToProps, mapDispatchToProps)(PureAtlaspNavbar);
