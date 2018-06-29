import * as React from "react";
import { connect } from "react-redux";

import { Dialog, Icon, Popover, Position } from "@blueprintjs/core";

import Event from "../Helpers/Event";
import User from "../Helpers/User";
import IStoreState, { IEventMap, IUserMap } from "../State/IStoreState";

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
    openInformationPopover: boolean;
}

export class PureSinglePersonDataDialog extends React.Component<
    ISinglePersonDataDialogProps & ISinglePersonDataDialogStoreProps,
    ISinglePersonDataDialogState> {
    public state = {
        openInformationPopover: false,
    };

    public render() {
        return (
            <Dialog
                icon="person"
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
                title="Person Info"
            >
                <div className="pt-dialog-body flexbox-column">
                    <div className="flexbox-row" style={{ flexGrow: 1, marginBottom: "15px" }}>
                        <u className="flex-basis flex-basis-20">ID</u>
                        <u className="flex-basis flex-basis-15">Host</u>
                        <u className="flex-basis flex-basis-35">Description</u>
                        <u className="flex-basis flex-basis-15">Date</u>
                        <u className="flex-basis flex-basis-15" style={{ justifyContent: "center" }}>People</u>
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

    private openInformationHover = () => this.setState({ openInformationPopover: true });
    private closeInformationHover = () => this.setState({ openInformationPopover: false });

    private renderEventStuff(event: Event, index: number) {
        if (this.props.userData === undefined) {
            return null;
        }
        return (
            <div key={index} className="flexbox-row" style={{ flexGrow: 1 }}>
                <div className="flex-basis flex-basis-20">
                    {event.id}
                </div>
                <div className="flex-basis flex-basis-15">
                    {this.props.userData && this.props.userData[event.host].name}
                </div>
                <div className="flex-basis flex-basis-35" style={{ wordWrap: "break-word" }}>
                    {event.description}
                </div>
                <div className="flex-basis flex-basis-15">
                    {event.date}
                </div>
                <div className="flex-basis flex-basis-15" style={{ justifyContent: "center" }}>
                    <Popover isOpen={this.state.openInformationPopover} position={Position.RIGHT}>
                        <Icon
                            onMouseEnter={this.openInformationHover}
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
