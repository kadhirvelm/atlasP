import * as React from "react";
import { connect } from "react-redux";

import { Dialog, Icon, Popover, Position } from "@blueprintjs/core";

import IStoreState from "../../../State/IStoreState";
import { IEvent, IEventMap } from "../../../Types/Events";
import { IUser, IUserMap } from "../../../Types/Users";

import "./GlobalInfoGraphicHelpers.css";

export interface ISinglePersonDataDialogProps {
    events: string[] | undefined;
    isOpen: boolean;
    onClose: () => void;
    person: IUser;
}

export interface ISinglePersonDataDialogStoreProps {
    eventData?: IEvent[];
    userData?: IUserMap;
}

export interface ISinglePersonDataDialogState {
    openInformationPopover: string | undefined;
}

export class PureSinglePersonDataDialog extends React.Component<
    ISinglePersonDataDialogProps & ISinglePersonDataDialogStoreProps,
    ISinglePersonDataDialogState> {
    public state = {
        openInformationPopover: undefined,
    };

    public render() {
        return (
            <Dialog
                icon="person"
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
                title={this.props.person.name}
            >
                <div className="flexbox-column">
                    <div className="flexbox-row">
                        <u className="flex-25">Date</u>
                        <u className="flex-25">Host</u>
                        <u className="flex-35">Description</u>
                        <u className="flex-15">People</u>
                    </div>
                    {this.renderInfoPersonContent()}
                </div>
            </Dialog>
        );
    }

    private renderInfoPersonContent() {
        const { eventData } = this.props;
        if (eventData === undefined) {
            return null;
        }
        return eventData.map(event => this.renderEventDetails(event));
    }

    private openInformationHover = (eventID: string) => () => this.setState({ openInformationPopover: eventID });
    private closeInformationHover = () => this.setState({ openInformationPopover: undefined });

    private renderEventDetails(event: IEvent) {
        const { userData } = this.props;
        if (userData === undefined) {
            return null;
        }
        return (
            <div key={event.id} className="single-event-row">
                <div className="flex-25">
                    {event.date.toLocaleDateString()}
                </div>
                <div className="flex-25">
                    {userData[event.host.id].name}
                </div>
                <div className="flex-35">
                    {event.description}
                </div>
                {this.renderPeoplePopover(event)}
            </div>
        );
    }

    private renderPeoplePopover(event: IEvent) {
        return (
            <div className="flex-15 flexbox-centered">
                    <Popover isOpen={this.state.openInformationPopover === event.id} position={Position.RIGHT}>
                        <Icon
                            onMouseEnter={this.openInformationHover(event.id)}
                            onMouseLeave={this.closeInformationHover}
                            icon="people"
                        />
                        <div style={{ padding: "15px", textAlign: "center" }}>
                            <div className="flexbox-column">
                                {this.renderEventAttendees(event)}
                            </div>
                        </div>
                    </Popover>
                </div>
        );
    }

    private renderEventAttendees(event: IEvent) {
        return event.attendees.map((user: IUser) => (
                <div key={user.id}> {user.name} ({user.id.slice(-6)}) </div>
            ),
        );
    }
}

function mapAndSortEvents(events: string[] | undefined, eventData?: IEventMap) {
    if (events === undefined || eventData === undefined) {
        return undefined;
    }
    return events.map(id => eventData[id]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function mapStateToProps(state: IStoreState, ownProps: ISinglePersonDataDialogProps & ISinglePersonDataDialogStoreProps): ISinglePersonDataDialogStoreProps {
    return {
        eventData: mapAndSortEvents(ownProps.events, state.DatabaseReducer.eventData),
        userData: state.DatabaseReducer.userData,
    };
}

export const SinglePersonDataDialog = connect(mapStateToProps)(PureSinglePersonDataDialog);
