import * as React from "react";
import { connect } from "react-redux";

import { Dialog, Icon, Popover, Position } from "@blueprintjs/core";

import Event from "../../Helpers/Event";
import User from "../../Helpers/User";
import IStoreState, { IEventMap, IUserMap } from "../../State/IStoreState";

import "./GlobalInfoGraphicHelpers.css";

export interface ISinglePersonDataDialogProps {
    events: number[];
    isOpen: boolean;
    onClose: () => void;
    person: User;
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
                title="Person Info"
            >
                <div className="flexbox-column">
                    <div className="flexbox-row">
                        <u className="flex-basis-20">Event ID</u>
                        <u className="flex-basis-15">Host</u>
                        <u className="flex-basis-10">People</u>
                        <u className="flex-basis-15 flexbox-centered">Date</u>
                        <u className="flex-basis-35 flexbox-centered">Description</u>
                    </div>
                    {this.renderInfoPersonContent()}
                </div>
            </Dialog>
        );
    }

    private renderInfoPersonContent() {
        return this.props.events.map((eventID: number, index: number) => {
            const event: Event = this.props.eventData && this.props.eventData[eventID];
            return this.renderEventStuff(event, index);
        });
    }

    private openInformationHover = (eventID: string) => () => this.setState({ openInformationPopover: eventID });
    private closeInformationHover = () => this.setState({ openInformationPopover: undefined });

    private renderEventStuff(event: Event, index: number) {
        if (this.props.userData === undefined) {
            return null;
        }
        return (
            <div key={index} className="flexbox-row" style={{ flexGrow: 1 }}>
                <div className="flex-basis-20">
                    {event.id}
                </div>
                <div className="flex-basis-15">
                    {this.props.userData && this.props.userData[event.host].name}
                </div>
                {this.renderPeoplePopover(event)}
                <div className="flex-basis-15 flexbox-centered">
                    {event.date}
                </div>
                <div className="flex-basis-35 flexbox-centered">
                    {event.description}
                </div>
            </div>
        );
    }

    private renderPeoplePopover(event: Event) {
        return (
            <div className="flex-basis-10" style={{ justifyContent: "center" }}>
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

    private renderEvents(event: Event) {
        return event.attendees.map((id: number) => (
                <div key={id}> {this.props.userData && this.props.userData[id].name} ({id}) </div>
            ),
        );
    }
}

function mapStateToProps(state: IStoreState): ISinglePersonDataDialogStoreProps {
    return {
        eventData: state.GoogleReducer.eventData,
        userData: state.GoogleReducer.userData,
    };
}

export const SinglePersonDataDialog = connect(mapStateToProps)(PureSinglePersonDataDialog);
