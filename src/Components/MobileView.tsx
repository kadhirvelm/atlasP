import * as React from "react";

import { Button } from "@blueprintjs/core";

import { AddNewEvent } from "./Dialogs/AddNewEvent";
import { AddNewPerson } from "./Dialogs/AddNewUser";
import { CurrentEvents } from "./InfoGraphicHelpers/CurrentEvents";

import "./MobileView.css";

export interface IMobileViewState {
    eventEntryDialogOpen: boolean;
    personEntryDialogOpen: boolean;
}

export class MobileView extends React.PureComponent<{}, IMobileViewState> {
    public state: IMobileViewState = { 
        eventEntryDialogOpen: false,
        personEntryDialogOpen: false,
    };

    public render() {
        return (
            <div className="main-mobile-view">
                <Button className="main-mobile-button" icon="add" text="New Event" onClick={this.handleOpenEventEntryDialog} />
                <Button className="main-mobile-button" icon="new-person" text="New Person" onClick={this.handleOpenPersonEntryDialog} />
                <CurrentEvents className="mobile-current-events" />
                {this.renderNewEventDialog()}
                {this.renderNewPersonDialog()}
            </div>
        )
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
}
