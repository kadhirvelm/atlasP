import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import { Icon, Text } from "@blueprintjs/core";

import IStoreState from "../../State/IStoreState";
import { IEvent } from "../../Types/Events";
import { IUser } from "../../Types/Users";
import {
  selectInfoPerson,
  selectInfoPersonSortedEvents
} from "../../Utils/selectors";
import { DialogWrapper } from "../Dialogs/DialogWrapper";
import { EditUser } from "../Dialogs/EditUser";
import { EventList } from "./EventList";

import "./InfoPerson.scss";

export interface IInfoPersonStoreProps {
  person: IUser | undefined;
  events: IEvent[] | undefined;
}

export interface IInfoPersonState {
  shouldShowEvents: boolean;
}

export class PureInfoPerson extends React.PureComponent<
  IInfoPersonStoreProps & IInfoPersonStoreProps,
  IInfoPersonState
> {
  public state: IInfoPersonState = {
    shouldShowEvents: true
  };

  public componentDidMount() {
    setTimeout(() => {
      this.setState({ shouldShowEvents: false });
    }, 1500);
  }

  public render() {
    if (this.props.person === undefined) {
      return null;
    }
    return (
      <div
        key={this.props.person.id}
        className={classNames(
          "main-info-graphic-container",
          "info-person",
          "bp3-dark",
          "show-change",
          {
            "should-show-events": this.state.shouldShowEvents
          }
        )}
      >
        <div className="info-person-name">
          <DialogWrapper dialog={EditUser}>
            <Text className="info-person-link" ellipsize={true}>
              {this.props.person.name}
            </Text>
          </DialogWrapper>
          <Icon
            className="info-person-minimizer"
            icon={
              this.state.shouldShowEvents ? "chevron-down" : "chevron-right"
            }
            onClick={this.changeShouldShow}
          />
        </div>
        {this.maybeRenderEventList()}
      </div>
    );
  }

  private maybeRenderEventList() {
    if (!this.state.shouldShowEvents) {
      return null;
    }
    return <EventList className="show-change" events={this.props.events} />;
  }

  private changeShouldShow = () =>
    this.setState({ shouldShowEvents: !this.state.shouldShowEvents });
}

function mapStateToProps(store: IStoreState): IInfoPersonStoreProps {
  return {
    events: selectInfoPersonSortedEvents(store),
    person: selectInfoPerson(store)
  };
}

export const InfoPerson = connect(mapStateToProps)(PureInfoPerson);
