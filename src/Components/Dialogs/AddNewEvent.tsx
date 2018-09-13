import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { Classes, Dialog, FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import { handleStringChange } from "@blueprintjs/docs-theme";

import IStoreState from "../../State/IStoreState";
import { IUser, IUserMap } from "../../Types/Users";
import { Autocomplete, IAutcompleteValuesProps } from "../Common/Autocomplete";
import { DialogUtils } from "./DialogUtils";
import { IDialogProps } from "./DialogWrapper";

import { showToast } from "../../Utils/Toaster";
import "./AddNewEvent.css";

export interface IAddNewEventStateProps {
    users: IUserMap | undefined;
}

export interface IAddNewEventDispatchProps {
    dialogUtils: DialogUtils;
}

export interface IFinalEventEmpty {
    attendees: IUser[];
    date: string;
    description: string;
    host: IUser | undefined;
}

export interface IFinalEventChecked extends IFinalEventEmpty {
    host: IUser;
}

export interface IAddNewEventState {
    finalEvent: IFinalEventEmpty | IFinalEventChecked;
    isSubmitting: boolean;
}

const EMPTY_STATE: IAddNewEventState = {
    finalEvent: {
        attendees: [],
        date: "",
        description: "",
        host: undefined,
    },
    isSubmitting: false,
}

export class PureAddNewEvent extends React.Component<
    IDialogProps & IAddNewEventStateProps & IAddNewEventDispatchProps, IAddNewEventState> {
    public state: IAddNewEventState = EMPTY_STATE;

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
                {this.props.dialogUtils.returnFooterActions(this.props.onClose, this.handleSubmit, this.state.isSubmitting)}
            </Dialog>
        );
    }

    private resetStateAndClose = () => {
        this.setState(EMPTY_STATE, () => {
            this.props.onClose();
        });
    }

    private handleSubmit = () => {
        this.setState({ isSubmitting: true }, async () => {
            try {
                const { finalEvent } = this.state;
                await this.props.dialogUtils.submitFinalEvent(finalEvent);
                showToast(Intent.SUCCESS, "Successfully added a new event.");
                this.props.onClose();
            } catch (error) {
                this.setState({ isSubmitting: false });
            }
        })
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
        users: state.DatabaseReducer.userData,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IAddNewEventDispatchProps {
    return {
        dialogUtils: new DialogUtils(dispatch),
    };
}

export const AddNewEvent = connect(mapStateToProps, mapDispatchToProps)(PureAddNewEvent);
