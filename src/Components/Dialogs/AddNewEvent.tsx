import * as React from "react";
import { connect } from "react-redux";

import { Button, Classes, Dialog, FormGroup, InputGroup } from "@blueprintjs/core";
import { handleStringChange } from "@blueprintjs/docs-theme";

import { IUser } from '../../Helpers/User';
import IStoreState, { IUserMap } from "../../State/IStoreState";
import { Autocomplete } from "../Common/Autocomplete";

import "./AddNewEvent.css";

export interface IAddNewEventStateProps {
    users: IUserMap | undefined;
}

interface IAddNewEventProps {
    isOpen: boolean;
    onClose(): void;
}

export interface IAddNewEventState {
    finalEvent: {
        attendees: string[];
        date: string;
        host: IUser | undefined;
    };
}

export class PureAddNewEvent extends React.Component<IAddNewEventProps & IAddNewEventStateProps, IAddNewEventState> {
    public state = {
        finalEvent: {
            attendees: [],
            date: "",
            host: undefined,
        },
    };

    public render() {
        return(
            <Dialog
                canEscapeKeyClose={false}
                canOutsideClickClose={false}
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
                title="Add New Event"
            >
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup>
                        <InputGroup className="input-group" onChange={this.handleChange("date")} placeholder="Date" />
                        <Autocomplete
                            dataSource={this.props.users}
                            displayKey="name"
                            placeholderText="Enter host name..."
                            values={this.hostValues()}
                            onSelection={this.handleHostSelection}
                        />
                        <InputGroup
                            className="input-group"
                            onChange={this.handleChange("attendees")}
                            placeholder="Attendees (comma separated)"
                        />
                    </FormGroup>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button text="Cancel" onClick={this.props.onClose} />
                    </div>
                </div>
            </Dialog>
        );
    }

    private isUser = (object: IUser | undefined): object is IUser => {
        return object != null && object.name != null;
    }

    private hostValues = () => {
        const finalHost = this.state.finalEvent.host;
        if(this.isUser(finalHost)) {
            return [finalHost.name];
        }
        return []
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
        users: state.GoogleReducer.userData,
    };
}

export const AddNewEvent = connect(mapStateToProps)(PureAddNewEvent);
