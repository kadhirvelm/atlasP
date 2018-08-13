import * as React from "react";

import { AddNewEvent } from "./Dialogs/AddNewEvent";
import { AddNewPerson } from "./Dialogs/AddNewUser";
import { DialogWrapper } from "./Dialogs/DialogWrapper";
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
                <DialogWrapper className="main-mobile-button" containerClassName="display" dialog={AddNewEvent} icon="add" text="New Event" />
                <DialogWrapper className="main-mobile-button" containerClassName="display" dialog={AddNewPerson} icon="new-person" text="Add Person" />
                <CurrentEvents className="mobile-current-events" />
            </div>
        )
    }
}
