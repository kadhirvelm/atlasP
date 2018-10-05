import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import { Icon, NonIdealState } from "@blueprintjs/core";

import IStoreState from "../../State/IStoreState";
import { IEvent } from "../../Types/Events";
import { IUser } from "../../Types/Users";
import { selectInfoPersonSortedEvents } from "../../Utils/selectors";
import { EventList } from "./EventList";

import "./InfoPerson.css";

export interface IPersonInformationProps {
    person: IUser | undefined;
    openInformationDialog(): void;
}

export interface IInfoPersonStoreProps {
    events: IEvent[] | undefined;
}

export class PureInfoPerson extends React.Component<IPersonInformationProps & IInfoPersonStoreProps> {
    public render() {
        if (this.props.person === undefined) {
            return this.renderNoPerson();
        }
        return (
            <div key={this.props.person.id} className={classNames("info-person", "bp3-dark", "show-change")}>
                <div className="name-container">
                    <div className="info-person-name">{this.props.person.name}</div>
                    <div className="more-icon">
                        <Icon
                            onClick={this.props.openInformationDialog}
                            icon="more"
                        />
                    </div>
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
