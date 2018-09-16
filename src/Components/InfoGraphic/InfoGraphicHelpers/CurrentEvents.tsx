import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import IStoreState from "../../../State/IStoreState";
import { IEvent } from "../../../Types/Events";
import { IUserMap } from "../../../Types/Users";
import { selectSortedEvents } from "../../../Utils/selectors";
import User from "../../../Utils/User";

import "./GlobalInfoGraphicHelpers.css";

export interface ICurrentEventsProps {
    className?: string;
}

export interface ICurrentEventsStoreProps {
    events: IEvent[];
    users: IUserMap | undefined;
}

export class PureCurrentEvents extends React.PureComponent<ICurrentEventsProps & ICurrentEventsStoreProps> {
    public componentWillMount() {
        this.renderSingleEvent = this.renderSingleEvent.bind(this);
    }

    public render() {
        return (
            <div className={classNames("info-person pt-dark", this.props.className)}>
                <h4> Events </h4>
                {this.maybeRenderEvents()}
            </div>
        )
    }

    private maybeRenderEvents() {
        const { events, users } = this.props;
        if (events === undefined || users === undefined) {
            return null;
        }
        return (
            <div className="flexbox-events overflow-y">
                {Object.values(this.props.events).map((event: IEvent) => this.renderSingleEvent(event, users))}
            </div>
        )
    }

    private renderSingleEvent(event: IEvent, users: IUserMap) {
        return (
            <div className="event" key={event.id}>
                <div> {event.date.toDateString()} </div>
                <div> {event.description} </div>
                <div> Host: {(users[event.host.id] as User).name} </div>
            </div>
        )
    }
}

function mapStateToProps(state: IStoreState): ICurrentEventsStoreProps {
    return {
        events: selectSortedEvents(state),
        users: state.DatabaseReducer.userData,
    }
}

export const CurrentEvents = connect(mapStateToProps)(PureCurrentEvents);
