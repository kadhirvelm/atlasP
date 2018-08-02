import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { Button, Classes, Dialog, FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import { handleStringChange } from "@blueprintjs/docs-theme";

import { IUser } from '../../Helpers/User';
import IStoreState, { IUserMap } from "../../State/IStoreState";
import { Autocomplete, IAutcompleteValuesProps } from "../Common/Autocomplete";
import { DialogUtils } from "./DialogUtils";

import "./AddNewEvent.css";

export interface IAddNewEventStateProps {
    rawData: any;
    users: IUserMap | undefined;
}

export interface IAddNewEventDispatchProps {
    dialogUtils: DialogUtils;
}

interface IAddNewEventProps {
    isOpen: boolean;
    onClose(): void;
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

    public componentDidMount() {
        this.props.dialogUtils.setReset(this.resetStateAndClose);
    }

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
        this.props.dialogUtils.setData(this.props.rawData);
        this.props.dialogUtils.submitFinalEvent(finalEvent);
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
    return {
        dialogUtils: new DialogUtils(dispatch),
    };
}

export const AddNewEvent = connect(mapStateToProps, mapDispatchToProps)(PureAddNewEvent);
