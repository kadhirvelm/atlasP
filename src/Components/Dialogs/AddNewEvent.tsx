import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { Button, Classes, Dialog, FormGroup, InputGroup, Intent, Toaster } from "@blueprintjs/core";
import { handleStringChange } from "@blueprintjs/docs-theme";

import { GoogleDispatcher } from "../../Dispatchers/GoogleDispatcher";
import Event from "../../Helpers/Event";
import { IUser } from '../../Helpers/User';
import IStoreState, { IUserMap } from "../../State/IStoreState";
import { Autocomplete, IAutcompleteValuesProps } from "../Common/Autocomplete";

import "./AddNewEvent.css";

export interface IAddNewEventStateProps {
    rawData: any;
    users: IUserMap | undefined;
}

export interface IAddNewEventDispatchProps {
    writeData(event: Event, users: IUser[], rawData: any): Promise<string | boolean>;
}

interface IAddNewEventProps {
    isOpen: boolean;
    onClose(): void;
}

interface IFinalEventEmpty {
    attendees: IUser[];
    date: string;
    description: string;
    host: IUser | undefined;
}

interface IFinalEventChecked extends IFinalEventEmpty {
    host: IUser;
}

export interface IAddNewEventState {
    finalEvent: IFinalEventEmpty | IFinalEventChecked;
}

const EMPTY_STATE: IAddNewEventState = {
    finalEvent: {
        attendees: [],
        date: "",
        description: "",
        host: undefined,
    },
}

export class PureAddNewEvent extends React.Component<
    IAddNewEventProps & IAddNewEventStateProps & IAddNewEventDispatchProps, IAddNewEventState> {
    public state: IAddNewEventState = EMPTY_STATE;

    private toaster: Toaster;
    private refHandler = {
        toaster: (ref: Toaster) => (this.toaster = ref),
    };

    public render() {
        return(
            <Dialog
                canEscapeKeyClose={false}
                canOutsideClickClose={false}
                isOpen={this.props.isOpen}
                onClose={this.resetStateAndClose}
                title="Add New Event"
            >
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup>
                        <InputGroup className="input-group" onChange={this.handleChange("date")} placeholder="Date" />
                        <InputGroup className="input-group" onChange={this.handleChange("description")} placeholder="Description" />
                        <Autocomplete
                            className="autocomplete-margin"
                            dataSource={this.props.users}
                            displayKey="name"
                            placeholderText="Search for host..."
                            values={this.finalEventValue("host")}
                            onSelection={this.handleHostSelection}
                        />
                        <Autocomplete
                            dataSource={this.props.users}
                            displayKey="name"
                            multiselection={true}
                            placeholderText="Search for users..."
                            values={this.finalEventValue("attendees")}
                            onSelection={this.handleAttendeeSelection}
                        />
                    </FormGroup>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={this.props.onClose} text="Cancel" />
                        <Button intent={Intent.PRIMARY} onClick={this.handleSubmit} text="Submit" />
                    </div>
                </div>
                <Toaster ref={this.refHandler.toaster} />
            </Dialog>
        );
    }

    private resetStateAndClose = () => {
        this.setState(EMPTY_STATE, () => {
            this.props.onClose();
        });
    }

    private handleSubmit = () => {
        const { finalEvent } = this.state;
        if (this.isCompleteEvent(finalEvent)) {
            finalEvent.attendees.push(finalEvent.host);
            this.sendEventAndUsersToAPI(finalEvent);
        } else {
            this.toaster.show({ intent: Intent.DANGER, message: "Cannot leave fields blank." });
        }
    }

    private sendEventAndUsersToAPI = async (finalEvent: IFinalEventChecked) => {
        const newEvent = new Event(
            this.assembleEventID(finalEvent),
            finalEvent.host.id,
            finalEvent.date,
            finalEvent.description
        );
        const resolution = await this.props.writeData(newEvent, finalEvent.attendees, this.props.rawData);
        if (resolution) {
            this.resetStateAndClose()
        } else {
            this.toaster.show({ intent: Intent.DANGER, message: "Error writing data to sheet. Check console for more details." });
        }
    }

    private assembleEventID = (finalEvent: IFinalEventChecked) => (finalEvent.host.id + '_' + finalEvent.date).replace(/\s/g, "_");

    private isCompleteEvent(finalEvent: IFinalEventEmpty): finalEvent is IFinalEventChecked{
        return (
            finalEvent.host !== undefined &&
            finalEvent.attendees.length > 0 &&
            finalEvent.date !== "" &&
            finalEvent.description !== ""
        );
    }

    private isUser = (object: IUser | undefined): object is IUser => {
        return object != null && object.name != null;
    }

    private finalEventValue = (key: string) => {
        const finalValue = this.state.finalEvent[key];
        if (finalValue == null) {
            return;
        } else if(this.isUser(finalValue)) {
            return {[finalValue.id]: finalValue.name};
        } else if (this.isUser(finalValue[0])) {
            return finalValue.map((user: IUser) => {
                return {[user.id]: user.name}
            }).reduce((a: IAutcompleteValuesProps, b: IAutcompleteValuesProps) => {
                return {...b, ...a}
            });
        }
        return finalValue
    }

    private handleAttendeeSelection = (item: IUser) => {
        if (!this.state.finalEvent.attendees.includes(item)) {
            this.adjustFinalEvent("attendees", [item, ...this.state.finalEvent.attendees]);
        } else {
            const finalAttendees = this.state.finalEvent.attendees.slice();
            finalAttendees.splice(finalAttendees.map(a => a.id).indexOf(item.id), 1);
            this.adjustFinalEvent("attendees", finalAttendees);
        }
    }

    private handleHostSelection = (item: IUser) => {
        this.adjustFinalEvent("host", item);
    }

    private handleChange = (key: string) => {
        return handleStringChange(
            (newValue) => {
                this.adjustFinalEvent(key, newValue);
        });
    }
    
    private adjustFinalEvent = (key: string, newValue: any) => {
        this.setState({ finalEvent: {...this.state.finalEvent, [key]: newValue } });
    }
}

function mapStateToProps(state: IStoreState): IAddNewEventStateProps {
    return {
        rawData: state.GoogleReducer.rawData,
        users: state.GoogleReducer.userData,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IAddNewEventDispatchProps {
    const googleDispatch = new GoogleDispatcher(dispatch);
    return {
        writeData: googleDispatch.writeData,
    };
}

export const AddNewEvent = connect(mapStateToProps, mapDispatchToProps)(PureAddNewEvent);
