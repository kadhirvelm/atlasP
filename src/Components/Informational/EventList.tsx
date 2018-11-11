import classNames from "classnames";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";

import { Icon, NonIdealState, Text, Tooltip } from "@blueprintjs/core";

import IStoreState from "../../State/IStoreState";
import { SelectEvent } from "../../State/WebsiteActions";
import { IEvent } from "../../Types/Events";
import { IUser } from "../../Types/Users";
import { UpdateEvent } from "../Dialogs/UpdateEvent";

import "./EventList.scss";

export interface IEventListProps {
  className?: string;
  events: IEvent[] | undefined;
}

export interface IEventsListStoreProps {
  selectedEvent: IEvent | undefined;
}

export interface IEventListDispatchProps {
  selectEvent(event: IEvent | undefined): void;
}

class PureEventList extends React.PureComponent<
  IEventListProps &
    IEventListProps &
    IEventsListStoreProps &
    IEventListDispatchProps
> {
  public componentWillMount() {
    this.renderSingleEvent = this.renderSingleEvent.bind(this);
    this.selectEvent = this.selectEvent.bind(this);
  }

  public render() {
    return (
      <div
        className={classNames("info-person", "bp3-dark", this.props.className)}
      >
        <div className="title"> Events </div>
        {this.maybeRenderEvents()}
      </div>
    );
  }

  private maybeRenderEvents() {
    const { events } = this.props;
    if (events === undefined || events.length === 0) {
      return <NonIdealState title="No events to display" />;
    }
    return (
      <div className="flexbox-events overflow-y">
        {Object.values(events).map((event: IEvent) =>
          this.renderSingleEvent(event)
        )}
        <UpdateEvent
          isOpen={this.props.selectedEvent !== undefined}
          onClose={this.clearSelectedEvent}
        />
      </div>
    );
  }

  private renderSingleEvent(event: IEvent) {
    const finalEvent =
      typeof event.date === "string" ? new Date(event.date) : event.date;
    return (
      <div className="event" key={event.id} onClick={this.selectEvent(event)}>
        <div className="event-labels">
          <div className="date">{finalEvent.toDateString()}</div>
          <Tooltip
            className="bp3-light"
            content={this.renderAttendees(event.attendees)}
            hoverOpenDelay={400}
          >
            <div className="attendees">
              <Icon className="people_icon" icon="people" />
              {event.attendees.length}
            </div>
          </Tooltip>
        </div>
        <Text className="description" ellipsize={true}>
          {" "}
          {event.description}{" "}
        </Text>
      </div>
    );
  }

  private renderAttendees(attendees: IUser[]) {
    return (
      <div className="event-list-attendees">
        {attendees
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(user => (
            <div key={user.id}>{user.name}</div>
          ))}
      </div>
    );
  }

  private clearSelectedEvent = () => this.props.selectEvent(undefined);
  private selectEvent(event: IEvent) {
    return () => this.props.selectEvent(event);
  }
}

function mapStateToProps(state: IStoreState): IEventsListStoreProps {
  return {
    selectedEvent: state.WebsiteReducer.selectedEvent
  };
}

function mapDispatchToProps(dispatch: Dispatch): IEventListDispatchProps {
  return bindActionCreators(
    {
      selectEvent: SelectEvent.create
    },
    dispatch
  );
}

export const EventList = connect(
  mapStateToProps,
  mapDispatchToProps
)(PureEventList);
