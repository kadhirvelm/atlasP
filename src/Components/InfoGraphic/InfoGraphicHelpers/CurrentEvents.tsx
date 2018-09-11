import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import IStoreState from "../../../State/IStoreState";
import { IUserMap } from "../../../Types/Users";
import Event from "../../../Utils/Event";
import { selectSortedEvents } from "../../../Utils/selectors";
import User from "../../../Utils/User";

import "./GlobalInfoGraphicHelpers.css";

export interface ICurrentEventsProps {
    className?: string;
}

export interface ICurrentEventsStoreProps {
    events: Event[];
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
                {Object.values(this.props.events).map((event: Event) => this.renderSingleEvent(event, users))}
            </div>
        )
    }

    private renderSingleEvent(event: Event, users: IUserMap) {
        return (
            <div className="event" key={event.id}>
                <div> {event.date} </div>
                <div> {event.description} </div>
                <div> Host: {(users[event.host] as User).name} </div>
            </div>
        )
    }
}

function mapStateToProps(state: IStoreState): ICurrentEventsStoreProps {
    return {
        events: selectSortedEvents(state),
        users: state.GoogleReducer.userData,
    }
}

export const CurrentEvents = connect(mapStateToProps)(PureCurrentEvents);
