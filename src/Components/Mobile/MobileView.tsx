import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Alignment, Button, Menu, MenuItem, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, Popover } from "@blueprintjs/core";

import { EmptyDatabaseCache } from "../../State/DatabaseActions";
import IStoreState from "../../State/IStoreState";
import { IEvent } from "../../Types/Events";
import { IUser } from "../../Types/Users";
import { selectSortedEvents } from "../../Utils/selectors";
import { AddNewEvent } from "../Dialogs/AddNewEvent";
import { AddNewPerson } from "../Dialogs/AddNewUser";
import { DialogWrapper } from "../Dialogs/DialogWrapper";
import { UpdateUser } from "../Dialogs/UpdateUser";
import { EventList } from "../Informational/EventList";

import "./MobileView.css";

export interface IMobileViewState {
    accountDetailsDialogOpen: boolean;
    eventEntryDialogOpen: boolean;
    personEntryDialogOpen: boolean;
}

export interface IMobileViewStore {
    currentUser: IUser | undefined;
    events: IEvent[] | undefined;
}

export interface IMobileViewDispatchProps {
    signOut(): void;
}

export class PureMobileView extends React.PureComponent<IMobileViewStore & IMobileViewDispatchProps, IMobileViewState> {
    public state: IMobileViewState = {
        accountDetailsDialogOpen: false,
        eventEntryDialogOpen: false,
        personEntryDialogOpen: false,
    };

    public render() {
        if (this.props.currentUser === undefined) {
            return null;
        }
        return (
            <div className="main-mobile-view">
                <Navbar className="pt-dark" style={{ zIndex: 10 }}>
                    <NavbarGroup align={Alignment.LEFT}>
                        <NavbarHeading> AtlasP </NavbarHeading>
                        <NavbarDivider />
                    </NavbarGroup>
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
                </Navbar>
                <DialogWrapper className="main-mobile-button" containerClassName="display" dialog={AddNewEvent} icon="add" text="New Event" />
                <DialogWrapper className="main-mobile-button" containerClassName="display" dialog={AddNewPerson} icon="new-person" text="Add Person" />
                <EventList className="mobile-current-events" events={this.props.events} />
            </div>
        )
    }

    private handleOpenAccountDetails = () => this.setState({ accountDetailsDialogOpen: true });
    private handleCloseAccountDetails = () => this.setState({ accountDetailsDialogOpen: false });
    
    private handleSignOut = () => this.props.signOut();
}

function mapStoreToProps(state: IStoreState): IMobileViewStore {
    return {
        currentUser: state.DatabaseReducer.currentUser,
        events: selectSortedEvents(state),
    }
}
function mapDispatchToProps(dispatch: Dispatch): IMobileViewDispatchProps {
    return bindActionCreators({ signOut: EmptyDatabaseCache.create }, dispatch);
}

export const MobileView = connect(mapStoreToProps, mapDispatchToProps)(PureMobileView);
