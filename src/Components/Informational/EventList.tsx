import * as classNames from "classnames";
import * as React from "react";

import { Icon, Text } from "@blueprintjs/core";

import { IEvent } from "../../Types/Events";

import "./EventList.css";

export interface IEventListProps {
    className?: string;
}

export interface IEventListProps {
    events: IEvent[] | undefined;
}

export class EventList extends React.PureComponent<IEventListProps & IEventListProps> {
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
                    <div className="attendees"><Icon className="people_icon" icon="people" />{event.attendees.length}</div>
                </div>
                <Text className="description" ellipsize={true}> {event.description} </Text>
            </div>
        )
    }
}
