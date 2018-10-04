import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import { Icon, Text } from "@blueprintjs/core";

import IStoreState from "../../State/IStoreState";
import { IEvent } from "../../Types/Events";
import { selectSortedEvents } from "../../Utils/selectors";

import "./CurrentEvents.css";

export interface ICurrentEventsProps {
    className?: string;
}

export interface ICurrentEventsStoreProps {
    events: IEvent[];
}

export class PureCurrentEvents extends React.PureComponent<ICurrentEventsProps & ICurrentEventsStoreProps> {
    public componentWillMount() {
        this.renderSingleEvent = this.renderSingleEvent.bind(this);
    }

    public render() {
        return (
            <div className={classNames("info-person", "pt-dark", this.props.className)}>
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
                {Object.values(this.props.events).map((event: IEvent) => this.renderSingleEvent(event))}
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

function mapStateToProps(state: IStoreState): ICurrentEventsStoreProps {
    return {
        events: selectSortedEvents(state),
    }
}

export const CurrentEvents = connect(mapStateToProps)(PureCurrentEvents);
