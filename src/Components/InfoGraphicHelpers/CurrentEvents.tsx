import * as React from "react";
import { connect } from "react-redux";

import Event from "../../Helpers/Event";
import { selectSortedEvents } from "../../Helpers/selectors";
import User from "../../Helpers/User";
import IStoreState, { IUserMap } from "../../State/IStoreState";

import "./GlobalInfoGraphicHelpers.css";

export interface ICurrentEventsStoreProps {
    events: Event[];
    users: IUserMap | undefined;
}

export class PureCurrentEvents extends React.PureComponent<ICurrentEventsStoreProps> {
    public componentWillMount() {
        this.renderSingleEvent = this.renderSingleEvent.bind(this);
    }

    public render() {
        return (
            <div className="info-person pt-dark">
                <h4> Events </h4>
                {this.maybeRenderEvents()}
            </div>
        )
    }

    private maybeRenderEvents() {
        if (this.props.events === undefined) {
            return null;
        }
        return (
            <div className="flexbox-events overflow-y">
                {Object.values(this.props.events).map(this.renderSingleEvent)}
            </div>
        )
    }

    private renderSingleEvent(event: Event) {
        const { users } = this.props;
        if (users === undefined) {
            return null;
        }
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
