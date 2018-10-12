import * as classNames from "classnames";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { Button, Classes, Dialog, EditableText } from "@blueprintjs/core";

import { DatabaseDispatcher } from "../../Dispatchers/DatabaseDispatcher";
import IStoreState from "../../State/IStoreState";
import { IEvent } from "../../Types/Events";
import { IUserMap } from "../../Types/Users";
import { Autocomplete } from "../Common/Autocomplete";
import { DialogUtils } from "./DialogUtils";
import { IDialogProps } from "./DialogWrapper";

import "./Update.css";
import "./UpdateEvents.css";

export interface IUpdateEventStoreProps {
    selectedEvent: IEvent | undefined;
    users: IUserMap | undefined;
}

export interface IUpdateEventDispatchProps {
    dialogUtils: DialogUtils;
    updateEvent(event: IEvent): void;
}

export interface IUpdateEventState {
    isLoading: boolean;
    selectedEvent?: IEvent;
}

class PureUpdateEvent extends React.Component<IDialogProps & IUpdateEventStoreProps & IUpdateEventDispatchProps, IUpdateEventState> {
    public state = {
        isLoading: false,
        selectedEvent: this.props.selectedEvent,
    };

    public componentWillReceiveProps(nextProps: IUpdateEventStoreProps) {
        if (nextProps.selectedEvent !== this.state.selectedEvent) {
            this.setState({ selectedEvent: nextProps.selectedEvent });
        }
    }

    public render() {
        return (
            <Dialog
                icon="edit"
                onClose={this.props.onClose}
                isOpen={this.props.isOpen}
                title="Update Event"
            >
                <div className={Classes.DIALOG_BODY}>
                    {this.maybeRenderEventDetails()}
                </div>
                <div className={classNames(Classes.DIALOG_FOOTER, Classes.DIALOG_FOOTER_ACTIONS)}>
                    <Button text="Cancel" onClick={this.props.onClose} />
                    <Button intent="primary" loading={this.state.isLoading} text="Save" onClick={this.handleUpdate}/>
                </div>
            </Dialog>
        )
    }

    private maybeRenderEventDetails() {
        const { selectedEvent } = this.state;
        if (selectedEvent === undefined) {
            return null;
        }
        return (
            <div className="edit-event-fields">
                <EditableText className={classNames("render-field-text", "edit-event-text")} onChange={this.editEvent("description")} value={selectedEvent.description} />
                <EditableText className={classNames("render-field-text", "edit-event-text")} onChange={this.editEvent("date")} value={selectedEvent.date.toLocaleString()} />
                <Autocomplete
                    className="input-group"
                    dataSource={this.props.users}
                    displayKey="name"
                    placeholderText="Search for host…"
                    values={{[selectedEvent.host.id]: selectedEvent.host.name}}
                    onSelection={this.editEvent("host")}
                />
                <Autocomplete
                    className="input-group"
                    dataSource={this.props.users}
                    displayKey="name"
                    multiselection={true}
                    placeholderText="Search for users…"
                    values={this.getAttendees(selectedEvent)}
                    onSelection={this.props.dialogUtils.handleAttendeeSelection(selectedEvent, this.updateAttendees)}
                />
            </div>
        )
    }

    private getAttendees(selectedEvent: IEvent) {
        return selectedEvent.attendees.map(user => ({ [user.id]: user.name })).reduce((previous, next) => ({ ...previous, ...next}), {});
    }

    private updateAttendees = (key: "attendees", value: any) => {
        this.editEvent(key)(value);
    }

    private editEvent(key: "date" | "description" | "host" | "attendees") {
        return (newValue: any) => {
            if (this.state.selectedEvent === undefined) {
                return;
            }
            this.setState({ selectedEvent: { ...this.state.selectedEvent, [key]: newValue } });
        };
    }

    private handleUpdate = () => {
        const { selectedEvent } = this.state;
        if (selectedEvent === undefined) {
            return;
        }

        this.setState({ isLoading: true }, async () => {
            try {
                await this.props.dialogUtils.updateFinalEvent(selectedEvent);
            } finally {
                this.setState({ isLoading: false });
            }
        });
    };
}

function mapStateToProps(state: IStoreState): IUpdateEventStoreProps {
    return {
        selectedEvent: state.WebsiteReducer.selectedEvent,
        users: state.DatabaseReducer.userData,
    }
}

function mapDispatchToProps(dispatch: Dispatch): IUpdateEventDispatchProps {
    return {
        dialogUtils: new DialogUtils(dispatch),
        updateEvent: new DatabaseDispatcher(dispatch).updateEvent,
    }
}

export const UpdateEvent = connect(mapStateToProps, mapDispatchToProps)(PureUpdateEvent);
