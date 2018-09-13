import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import {
    Alignment,
    Button,
    Intent,
    Menu,
    MenuItem,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Popover,
    Spinner,
} from "@blueprintjs/core";

import { EmptyDatabaseCache } from "../../State/DatabaseActions";
import IStoreState from "../../State/IStoreState";
import { IForceUpdate } from "../../Types/Other";
import { IUser } from "../../Types/Users";
import { AddNewEvent } from "../Dialogs/AddNewEvent";
import { AddNewPerson } from "../Dialogs/AddNewUser";
import { DialogWrapper } from "../Dialogs/DialogWrapper";
import { FetchPerson } from "../Dialogs/FetchPerson";
import { UpdateUser } from "../Dialogs/UpdateUser";

import "../Main.css";
import "./Navbar.css";

interface INavbarState {
  accountDetailsDialogOpen: boolean;
}

export interface INavbarProps {
    mobile?: boolean;
}

export interface INavbarStateProps {
    currentUser?: IUser;
    fetching: boolean;
    forceUpdate: IForceUpdate | undefined,
    isAdmin: boolean;
}

export interface INavbarDispatchProps {
    signOut(): void;
}

class PureAtlaspNavbar extends React.PureComponent<INavbarProps & INavbarStateProps & INavbarDispatchProps, INavbarState> {
    public state = {
        accountDetailsDialogOpen: this.props.forceUpdate !== undefined,
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
                {this.maybeRenderSpinner()}
                {this.maybeRenderOtherLeftButtons()}
            </NavbarGroup>
        );
    }

    private maybeRenderSpinner() {
        if (!this.props.fetching) {
            return null;
        }
        return <Spinner className="pt-small" intent={Intent.WARNING} />
    }

    private maybeRenderOtherLeftButtons() {
        if (this.props.mobile) {
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
        if (this.props.currentUser === undefined) {
            return null;
        }
        return (
            <NavbarGroup align={Alignment.RIGHT}>
                <Popover>
                    <Button icon="user" text={this.props.currentUser.name} rightIcon="caret-down" />
                    <Menu>
                        <MenuItem icon="edit" text="Account details"  onClick={this.handleOpenAccountDetails} />
                        <MenuItem icon="log-out" text="Sign out" onClick={this.handleSignOut} />
                    </Menu>
                </Popover>
                <UpdateUser isOpen={this.state.accountDetailsDialogOpen} onClose={this.handleCloseAccountDetails} />
            </NavbarGroup>
        );
    }

    private openSheet() {
        // tslint:disable-next-line:max-line-length
        window.open(`https://docs.google.com/spreadsheets/d/${process.env.REACT_APP_SPREADSHEET}`, "_blank");
    }

    private handleOpenAccountDetails = () => this.setState({ accountDetailsDialogOpen: true });
    private handleCloseAccountDetails = () => this.setState({ accountDetailsDialogOpen: false });

    private handleSignOut = () => this.props.signOut();
}

function mapStateToProps(state: IStoreState): INavbarStateProps {
  return {
    currentUser: state.DatabaseReducer.currentUser,
    fetching: state.DatabaseReducer.isFetching,
    forceUpdate: state.DatabaseReducer.forceUpdate,
    isAdmin: false,
  };
}

function mapDispatchToProps(dispatch: Dispatch): INavbarDispatchProps {
    return bindActionCreators({ signOut: EmptyDatabaseCache.create }, dispatch);
}

export const AtlaspNavbar = connect(mapStateToProps, mapDispatchToProps)(PureAtlaspNavbar);
