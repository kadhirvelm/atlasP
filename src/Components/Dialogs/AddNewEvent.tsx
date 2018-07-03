import * as React from "react";

import { Button, Classes, Dialog, FormGroup, InputGroup } from "@blueprintjs/core";
import { handleStringChange } from "@blueprintjs/docs-theme";

import "./AddNewEvent.css";

interface IAddNewEventProps {
    isOpen: boolean;
    onClose(): void;
}

export interface IAddNewEventState {
    finalEvent: {
        attendees: string[];
        date: string;
        host: number;
    };
}

export class AddNewEvent extends React.Component<IAddNewEventProps, IAddNewEventState> {
    public state = {
        finalEvent: {
            attendees: [],
            date: "",
            host: 0,
        },
    };

    public render() {
        console.log(this.state.finalEvent);
        return(
            <Dialog
                canOutsideClickClose={false}
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
                title="Add New Event"
            >
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup>
                        <InputGroup className="input-group" onChange={this.handleChange("date")} placeholder="Date" />
                        <InputGroup
                            className="input-group"
                            onChange={this.handleChange("host")}
                            placeholder="Host Name or ID"
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

    private handleChange = (key: string) => {
        return handleStringChange(
            (newValue) => {
                console.log(newValue, key);
                this.setState({ finalEvent: {...this.state.finalEvent, [key]: newValue } });
        });
    }
}
