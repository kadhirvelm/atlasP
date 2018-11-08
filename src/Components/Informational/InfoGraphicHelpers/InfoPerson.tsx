import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import { NonIdealState, Text } from "@blueprintjs/core";

import IStoreState from "../../../State/IStoreState";
import { IEvent } from "../../../Types/Events";
import { IUser } from "../../../Types/Users";
import { selectInfoPersonSortedEvents } from "../../../Utils/selectors";
import { EventList } from "./EventList";

import "./InfoPerson.scss";

export interface IPersonInformationProps {
    person: IUser | undefined;
    openInformationDialog(): void;
}

export interface IInfoPersonStoreProps {
    events: IEvent[] | undefined;
}

export class PureInfoPerson extends React.PureComponent<IPersonInformationProps & IInfoPersonStoreProps> {
    public render() {
        if (this.props.person === undefined) {
            return this.renderNoPerson();
        }
        return (
            <div key={this.props.person.id} className={classNames("info-person", "bp3-dark", "show-change")}>
                <div className="info-person-name" onClick={this.props.openInformationDialog}>
                    <Text ellipsize={true}>{this.props.person.name}</Text>
                </div>
                <EventList className="show-change" events={this.props.events} />
            </div>
        );
    }

    private renderNoPerson() {
        return (
            <div key="No Person" className="info-person">
                <NonIdealState icon="person" />
            </div>
        );
    }
}

function mapStateToProps(store: IStoreState): IInfoPersonStoreProps {
    return {
        events: selectInfoPersonSortedEvents(store),
    }
}

export const InfoPerson = connect(mapStateToProps)(PureInfoPerson);
