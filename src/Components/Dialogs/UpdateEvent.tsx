import * as classNames from "classnames";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { Button, Classes, Dialog, EditableText } from "@blueprintjs/core";

import { DatabaseDispatcher } from "../../Dispatchers/DatabaseDispatcher";
import IStoreState from "../../State/IStoreState";
import { IEvent } from "../../Types/Events";
import { IUser } from "../../Types/Users";
import { Autocomplete } from "../Common/Autocomplete";
import { DialogUtils } from "./DialogUtils";
import { IDialogProps } from "./DialogWrapper";

import "./Update.css";
import "./UpdateEvents.css";

export interface IUpdateEventStoreProps {
    selectedEvent: IEvent | undefined;
    users: Map<string, IUser> | undefined;
}

export interface IUpdateEventDispatchProps {
    dialogUtils: DialogUtils;
    updateEvent(event: IEvent): void;
}

export interface IUpdateEventState {
    isLoading: boolean;
    newDate: string;
    selectedEvent?: IEvent;
}

class PureUpdateEvent extends React.PureComponent<IDialogProps & IUpdateEventStoreProps & IUpdateEventDispatchProps, IUpdateEventState> {
    public state = {
        isLoading: false,
        newDate: "",
        selectedEvent: this.props.selectedEvent,
    };

    public componentWillReceiveProps(nextProps: IUpdateEventStoreProps) {
        if (nextProps.selectedEvent !== this.state.selectedEvent && nextProps.selectedEvent !== undefined) {
            this.setState({ newDate: this.formatDate(nextProps.selectedEvent.date), selectedEvent: nextProps.selectedEvent });
        }
    }

    public render() {
        const { selectedEvent } = this.state;
        if (selectedEvent === undefined) {
            return null;
        }
        return (
            <Dialog
                icon="edit"
                onClose={this.props.onClose}
                isOpen={this.props.isOpen}
                title="Update Event"
            >
                <div className={Classes.DIALOG_BODY}>
                    {this.maybeRenderEventDetails(selectedEvent)}
                </div>
                <div className={classNames(Classes.DIALOG_FOOTER, Classes.DIALOG_FOOTER_ACTIONS)}>
                    <Button onClick={this.props.onClose} text="Cancel" />
                    <Button intent="primary" loading={this.state.isLoading} onClick={this.handleUpdate(selectedEvent)} text="Save" />
                </div>
            </Dialog>
        )
    }

    private maybeRenderEventDetails(selectedEvent: IEvent) {
        return (
            <div className="edit-event-fields">
                <EditableText className={classNames("render-field-text", "edit-event-text")} onChange={this.editEvent(selectedEvent, "description")} value={selectedEvent.description} />
                <Autocomplete
                    className={classNames("input-group", "autocomplete-attendees")}
                    dataSource={this.props.users}
                    displayKey="name"
                    multiselection={true}
                    placeholderText="Search for users…"
                    values={this.getAttendees(selectedEvent)}
                    onSelection={this.props.dialogUtils.handleAttendeeSelection(selectedEvent, this.updateAttendees(selectedEvent))}
                />
                <EditableText className={classNames("render-field-text", "edit-event-text")} placeholder={`Eg. ${new Date().toLocaleDateString()}…`} onChange={this.editDate} onConfirm={this.editEventDate(selectedEvent)} value={this.state.newDate} />
            </div>
        )
    }

    private getAttendees(selectedEvent: IEvent) {
        return selectedEvent.attendees.map(user => ({ [user.id]: user.name })).reduce((previous, next) => ({ ...previous, ...next}), {});
    }

    private updateAttendees(selectedEvent: IEvent) {
        return (key: "attendees", value: any) => this.editEvent(selectedEvent, key)(value);
    }

    private editDate = (newDate: string) => this.setState({ newDate })

    private editEventDate(selectedEvent: IEvent) {
        return (newDate: string) => {
            const date = new Date(newDate);
            this.setState({ selectedEvent: { ...selectedEvent, date, newDate: this.formatDate(date) } })
        };
    }

    private editEvent(selectedEvent: IEvent, key: "description" | "attendees") {
        return (newValue: any) => this.setState({ selectedEvent: { ...selectedEvent, [key]: newValue } });
    }

    private handleUpdate(selectedEvent: IEvent) {
        return () => {
            this.setState({ isLoading: true }, async () => {
                try {
                    await this.props.dialogUtils.updateFinalEvent(selectedEvent);
                } catch(e) {
                    console.error(e);
                } finally {
                    this.setState({ isLoading: false });
                }
            });
        }
    };

    private formatDate = (date: Date) => date.toLocaleString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit", hour: "numeric", minute: "numeric", hour12: true });
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
