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
    eventData?: IEventMap;
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
                        <u className="flex-10">People</u>
                    </div>
                    {this.renderInfoPersonContent()}
                </div>
            </Dialog>
        );
    }

    private renderInfoPersonContent() {
        const { events } = this.props;
        if (events === undefined) {
            return null;
        }
        return events.map((eventID: string, index: number) => {
            const event = this.props.eventData && this.props.eventData[eventID];
            if (event === undefined) {
                return undefined;
            }
            return this.renderEventDetails(event, index);
        });
    }

    private openInformationHover = (eventID: string) => () => this.setState({ openInformationPopover: eventID });
    private closeInformationHover = () => this.setState({ openInformationPopover: undefined });

    private renderEventDetails(event: IEvent, index: number) {
        if (this.props.userData === undefined) {
            return null;
        }
        return (
            <div key={index} className="single-event-row">
                <div className="flex-25">
                    {event.date.toDateString()}
                </div>
                <div className="flex-25">
                    {this.props.userData && this.props.userData[event.host.id].name}
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
            <div className="flex-10 flexbox-centered">
                    <Popover isOpen={this.state.openInformationPopover === event.id} position={Position.RIGHT}>
                        <Icon
                            onMouseEnter={this.openInformationHover(event.id)}
                            onMouseLeave={this.closeInformationHover}
                            icon="people"
                        />
                        <div style={{ padding: "15px", textAlign: "center" }}>
                            <div className="flexbox-column">
                                {this.renderEvents(event)}
                            </div>
                        </div>
                    </Popover>
                </div>
        );
    }

    private renderEvents(event: IEvent) {
        return event.attendees.map((user: IUser) => (
                <div key={user.id}> {user.name} ({user.id}) </div>
            ),
        );
    }
}

function mapStateToProps(state: IStoreState): ISinglePersonDataDialogStoreProps {
    return {
        eventData: state.DatabaseReducer.eventData,
        userData: state.DatabaseReducer.userData,
    };
}

export const SinglePersonDataDialog = connect(mapStateToProps)(PureSinglePersonDataDialog);
