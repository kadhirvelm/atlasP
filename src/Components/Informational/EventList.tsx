import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import { Icon, Text, Tooltip } from "@blueprintjs/core";

import IStoreState from "../../State/IStoreState";
import { IEvent } from "../../Types/Events";
import { IUser, IUserMap } from "../../Types/Users";

import "./EventList.css";

export interface IEventListProps {
    className?: string;
}

export interface IEventsListStoreProps {
    usersMap: IUserMap | undefined;
}

export interface IEventListProps {
    events: IEvent[] | undefined;
}

class PureEventList extends React.PureComponent<IEventListProps & IEventListProps & IEventsListStoreProps> {
    public componentWillMount() {
        this.renderSingleEvent = this.renderSingleEvent.bind(this);
    }

    public render() {
        return (
            <div className={classNames("info-person", "bp3-dark", this.props.className)}>
                <div className="title"> Events </div>
                {this.maybeRenderEvents()}
            </div>
        )
    }

    private maybeRenderEvents() {
        const { events } = this.props;
        if (events === undefined) {
            return null;
        }
        return (
            <div className="flexbox-events overflow-y">
                {Object.values(events).map((event: IEvent) => this.renderSingleEvent(event))}
            </div>
        )
    }

    private renderSingleEvent(event: IEvent) {
        const finalEvent = typeof event.date === "string" ? new Date(event.date) : event.date;
        return (
            <div className="event" key={event.id}>
                <div className="event-labels">
                    <div className="date">{finalEvent.toDateString()}</div>
                    <Tooltip className="bp3-light" content={this.renderAttendees(event.attendees)} hoverOpenDelay={400}>
                        <div className="attendees"><Icon className="people_icon" icon="people" />{event.attendees.length}</div>
                    </Tooltip>
                </div>
                <Text className="description" ellipsize={true}> {event.description} </Text>
            </div>
        )
    }

    private renderAttendees(attendees: IUser[]) {
        return (
            <div className="event-list-attendees">
                {attendees.sort((a, b) => a.name.localeCompare(b.name)).map((user) => (
                    <div>{user.name}</div>
                ))}
            </div>
        )
    }
}

function mapStateToProps(state: IStoreState): IEventsListStoreProps {
    return {
        usersMap: state.DatabaseReducer.userData,
    };
}

export const EventList = connect(mapStateToProps)(PureEventList);
