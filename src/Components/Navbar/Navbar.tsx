import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Button } from "@blueprintjs/core";

import { EmptyDatabaseCache } from "../../State/DatabaseActions";
import IStoreState from "../../State/IStoreState";
import { IForceUpdate } from "../../Types/Other";
import { IUser } from "../../Types/Users";
import { AddNewEvent } from "../Dialogs/AddNewEvent";
import { AddNewPerson } from "../Dialogs/AddNewUser";
import { DialogWrapper } from "../Dialogs/DialogWrapper";
import { UpdateUser } from "../Dialogs/UpdateUser";

import "../Main.css";
import "./Navbar.css";

const logo = require("./white_logo.svg");

interface INavbarState {
  accountDetailsDialogOpen: boolean;
  hovering: boolean;
}

export interface INavbarStateProps {
    currentUser?: IUser;
    fetching: boolean;
    forceUpdate: IForceUpdate | undefined,
}

export interface INavbarDispatchProps {
    signOut(): void;
}

class PureAtlaspNavbar extends React.PureComponent<INavbarStateProps & INavbarDispatchProps, INavbarState> {
    public state = {
        accountDetailsDialogOpen: this.props.forceUpdate !== undefined,
        hovering: false,
    };

    public render() {
        return(
            <div className={classNames("atlas-navbar", "pt-dark")} onMouseEnter={this.handleHoverStart} onMouseDown={this.handleHoverLeave} onMouseLeave={this.handleHoverLeave} style={{ zIndex: 10 }}>
                {this.renderLogo()}
                <div className="navbar-separator" />
                {this.renderAdditionItems()}
                <div className="navbar-separator" />
                {this.renderUserAccountItems()}
            </div>
        );
    }

    private renderLogo() {
        return (
            <>
                {this.renderNavbarComponent(<img height={40} src={logo} width={33} />, "AtlasP")}
            </>
        )
    }

    private renderAdditionItems() {
        return (
            <>
                {this.renderNavbarComponent(<DialogWrapper className="navbar-new-event" dialog={AddNewEvent} icon="add" text="" />, "New Event")}
                {this.renderNavbarComponent(<DialogWrapper className="navbar-new-person" dialog={AddNewPerson} icon="new-person" text="" />, "New Person")}
            </>
        )
    }

    private renderUserAccountItems() {
        return (
            <>
                {this.renderNavbarComponent(<DialogWrapper className="navbar-account" dialog={UpdateUser} icon="user" text="" />, "Account")}
                {this.renderNavbarComponent(<Button icon="log-out" onClick={this.props.signOut} text="" />, "Sign Out")}
            </>
        )
    }

    private renderNavbarComponent(mainElement: JSX.Element, secondaryElement: JSX.Element | string) {
        return (
            <div className="navbar-button-component">
                {mainElement}
                {this.state.hovering &&
                    <div className="navbar-hovered-component">
                        {secondaryElement}
                    </div>
                }
            </div>
        )
    }

    private handleHoverStart = () => this.setState({ hovering: true });
    private handleHoverLeave = () => this.setState({ hovering: false });
}

function mapStateToProps(state: IStoreState): INavbarStateProps {
  return {
    currentUser: state.DatabaseReducer.currentUser,
    fetching: state.DatabaseReducer.isFetching,
    forceUpdate: state.DatabaseReducer.forceUpdate,
  };
}

function mapDispatchToProps(dispatch: Dispatch): INavbarDispatchProps {
    return bindActionCreators({ signOut: EmptyDatabaseCache.create }, dispatch);
}

export const AtlaspNavbar = connect(mapStateToProps, mapDispatchToProps)(PureAtlaspNavbar);
