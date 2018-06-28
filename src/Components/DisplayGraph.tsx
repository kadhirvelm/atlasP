import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { calculateScore } from "../Helpers/GraphHelpers";
import { IPeopleGraph, ISingleLocation, selectMainPersonGraph, X_ORIGIN, Y_ORIGIN } from "../Helpers/Selectors";
import User from "../Helpers/User";
import IStoreState, { IEventMap, IUserMap } from "../State/IStoreState";
import { SetGraphRef, SetInfoPerson, SetMainPerson } from "../State/WebsiteActions";
import { RenderLine } from "./DisplayGraphHelpers/RenderLine";
import { RenderPerson } from "./DisplayGraphHelpers/RenderPerson";

import "./DisplayGraph.css";

export interface IDisplayGraphStateProps {
    graphRef: HTMLElement | null;
    eventData: IEventMap;
    userData: IUserMap;
    peopleGraph: IPeopleGraph,
}

export interface IDisplayGraphDispatchProps {
    setInfoPerson(infoPerson: User): void;
    setGraphRef(ref: HTMLElement | null): void;
    setMainPerson(mainPerson: User): void;
}

class PureDispayGraph extends React.Component<IDisplayGraphStateProps & IDisplayGraphDispatchProps> {
    public ORIGIN = {x: X_ORIGIN, y: Y_ORIGIN };

    public setRef = (ref: HTMLElement | null ) => {
        if (this.props.graphRef == null) {
            this.props.setGraphRef(ref);
        }
    }

    public render() {
        return(
            <div
                id="Graph Container"
                ref={this.setRef}
                className="flexbox-row"
                style={{ position: "relative", width: "100%", height: "100%" }}>
                {this.renderMainPerson()}
                {this.renderMainPersonConnections()}
                {this.renderConnectionLines()}
            </div>
        );
    }

    private returnEventDate = (events: number[]) => this.props.eventData[events.slice(-1)[0]];

    private renderMainPerson() {
        return (
            <RenderPerson
                dimension={this.props.peopleGraph.dimension}
                lastEventDate={this.returnEventDate(this.props.peopleGraph.mainPerson.events)}
                location={this.ORIGIN}
                scoreTally={{ isMain: true }}
                user={this.props.peopleGraph.mainPerson}
                changeInfoPerson={this.changeInfoPerson}
                changeMainPerson={this.changeMainPerson}
            />
        );
    }

    private renderMainPersonConnections() {
        return Object.keys(this.props.peopleGraph.mainPerson.connections).map((userID: string) => {
            const user = this.props.userData[userID];
            return (
                <RenderPerson
                    key={userID}
                    dimension={this.props.peopleGraph.dimension}
                    lastEventDate={this.returnEventDate(this.props.peopleGraph.mainPerson.connections[userID])}
                    location={this.props.peopleGraph.locations[userID]}
                    scoreTally={calculateScore(user, this.props.peopleGraph.mainPerson)}
                    user={user}
                    changeInfoPerson={this.changeInfoPerson}
                    changeMainPerson={this.changeMainPerson}
                />
            )
        })
    }

    private changeInfoPerson = (user: User) => {
        return () => this.props.setInfoPerson(user);
    }

    private changeMainPerson = (user: User) => {
        return () => this.props.setMainPerson(user);
    }

    private renderConnectionLines() {
        const origin = this.convertToAbsolutePoint(this.ORIGIN);
        return (
            <svg height={this.props.graphRef ? this.props.graphRef.clientHeight : "100%"} width={this.props.graphRef ? this.props.graphRef.clientWidth : "100%"}>
                {Object.entries(this.props.peopleGraph.connections).map((line) => (<RenderLine key={line[0]} lineSettings={line[1]} location={this.convertToAbsolutePoint(this.props.peopleGraph.locations[line[0]])} origin={origin} />))}
            </svg>
        )
    }

    private convertToAbsolutePoint(location: ISingleLocation){
        return this.props.graphRef ? { x: (this.props.graphRef.clientWidth * location.x / 100), y: (this.props.graphRef.clientHeight * location.y / 100) } : {x: 0, y: 0}
    }
}

function mapStateToProps(state: IStoreState): IDisplayGraphStateProps {
    return {
        eventData: state.GoogleReducer.eventData || {},
        graphRef: state.WebsiteReducer.graphRef,
        peopleGraph: selectMainPersonGraph(state),
        userData: state.GoogleReducer.userData || {},
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDisplayGraphDispatchProps {
    return bindActionCreators({
        setGraphRef: SetGraphRef.create,
        setInfoPerson: SetInfoPerson.create,
        setMainPerson: SetMainPerson.create,
    }, dispatch)
}

export const DisplayGraph = connect(mapStateToProps, mapDispatchToProps)(PureDispayGraph);
