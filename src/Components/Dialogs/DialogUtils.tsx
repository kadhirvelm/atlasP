import { Button, Classes, Intent } from "@blueprintjs/core";
import * as React from "react";
import { Dispatch } from "react-redux";

import { DatabaseDispatcher } from "../../Dispatchers/DatabaseDispatcher";
import Event from "../../Utils/Event";
import { showToast } from "../../Utils/Toaster";
import { IFinalEventChecked, IFinalEventEmpty } from "./AddNewEvent";
import { IFinalPerson } from "./AddNewUser";

export class DialogUtils {
    private databaseDispatcher: DatabaseDispatcher;

    public constructor(private dispatch: Dispatch) {
        this.databaseDispatcher = new DatabaseDispatcher(this.dispatch);
    }

    public async submitFinalPerson(finalPerson: IFinalPerson) {
        if (this.isCompletePerson(finalPerson)) {
            await this.databaseDispatcher.createNewUser(finalPerson);
        } else {
            showToast(Intent.DANGER, "Cannot leave fields blank/some fields are incorrect.");
        }
    }

    public submitFinalEvent(finalEvent: IFinalEventEmpty): Error | void {
        if (this.isCompleteEvent(finalEvent)) {
            finalEvent.attendees.push(finalEvent.host);
            this.sendEventAndUsersToAPI(finalEvent);
        } else {
            showToast(Intent.DANGER, "Cannot leave fields blank.");
            throw new Error("Event missing fields.");
        }
    }

    public returnFooterActions(onClose: () => void, handleSubmit: () => void, isActive?: boolean) {
        return (
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button onClick={onClose} text="Cancel" />
                    <Button intent={Intent.PRIMARY} loading={isActive} onClick={handleSubmit} text="Submit" />
                </div>
            </div>
        )
    }

    private isCompletePerson(finalPerson: IFinalPerson) {
        if (
            parseInt(finalPerson.age, 10) !== undefined &&
            finalPerson.name.length > 0 &&
            finalPerson.location.length > 0 &&
            (finalPerson.gender === "F" || finalPerson.gender === "M" || finalPerson.gender === "X")) {
            return true;
        }
        return false;
    }
    
    private sendEventAndUsersToAPI = async (finalEvent: IFinalEventChecked) => {
        const newEvent = new Event(
            this.assembleEventID(finalEvent),
            parseInt(finalEvent.host.id, 10),
            finalEvent.date,
            finalEvent.description,
            finalEvent.attendees,
        );
        console.log("NEW EVENT", newEvent);
    }
    
    private assembleEventID = (finalEvent: IFinalEventChecked) => (finalEvent.host.id + '_' + finalEvent.date).replace(/\s/g, "_");
    
    private isCompleteEvent(finalEvent: IFinalEventEmpty): finalEvent is IFinalEventChecked {
        return (
            finalEvent.host !== undefined &&
            finalEvent.attendees.length > 0 &&
            finalEvent.date !== "" &&
            finalEvent.description !== ""
        );
    }
}