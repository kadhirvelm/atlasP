import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import IStoreState, { IEventMap } from "../../State/IStoreState";
import { SetGraphRef, SetInfoPerson, SetMainPerson } from "../../State/WebsiteActions";
import { IUserMap } from "../../Types/Users";
import { calculateScore } from "../../Utils/GraphHelpers";
import { IPeopleGraph, ISingleLocation, ORIGIN, selectMainPersonGraph } from "../../Utils/selectors";
import User from "../../Utils/User";
import { RenderLine } from "./DisplayGraphHelpers/RenderLine";
import { RenderPerson } from "./DisplayGraphHelpers/RenderPerson";

export interface IDisplayGraphStoreProps {
    eventData: IEventMap;
    graphRef: HTMLElement | null;
    isAdmin?: boolean;
    userData: IUserMap;
    peopleGraph: IPeopleGraph;
}

export interface IDisplayGraphDispatchProps {
    setGraphRef(ref: HTMLElement | null): void;
    setInfoPerson(infoPerson: User): void;
    setMainPerson(mainPerson: User): void;
}

class PureDispayGraph extends React.Component<IDisplayGraphStoreProps & IDisplayGraphDispatchProps> {
    public componentWillMount() {
        this.changeInfoPerson = this.changeInfoPerson.bind(this);
        this.changeMainPerson = this.changeMainPerson.bind(this);
    }

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
                style={{ position: "relative", width: "100%", height: "100%" }}
            >
                {this.renderMainPerson()}
                {this.renderMainPersonConnections()}
                {this.renderConnectionLines()}
            </div>
        );
    }

    private returnEventDate = (events: string[]): string => this.props.eventData[events.slice(-1)[0]].date;

    private renderMainPerson() {
        return (
            <RenderPerson
                changeInfoPerson={this.changeInfoPerson}
                changeMainPerson={this.changeMainPerson}
                dimension={this.props.peopleGraph.dimension}
                lastEventDate={this.returnEventDate(this.props.peopleGraph.mainPerson.events)}
                location={ORIGIN}
                scoreTally={{ isMain: true }}
                user={this.props.peopleGraph.mainPerson}
            />
        );
    }

    private renderMainPersonConnections() {
        const { mainPerson } = this.props.peopleGraph;
        return Object.keys(this.props.peopleGraph.mainPerson.connections).map((userID: string) => {
            const user = this.props.userData[userID];
            return (
                <RenderPerson
                    changeInfoPerson={this.changeInfoPerson}
                    changeMainPerson={this.changeMainPerson}
                    dimension={this.props.peopleGraph.dimension}
                    key={`${mainPerson.id}_${userID}`}
                    lastEventDate={this.returnEventDate(this.props.peopleGraph.mainPerson.connections[userID])}
                    location={this.props.peopleGraph.locations[userID]}
                    scoreTally={calculateScore(user, this.props.peopleGraph.mainPerson)}
                    user={user}
                />
            );
        });
    }

    private changeInfoPerson(user: User) {
        return () => this.props.setInfoPerson(user);
    }

    private changeMainPerson(user: User) {
        return () => this.props.isAdmin && this.props.setMainPerson(user);
    }

    private renderConnectionLines() {
        if (this.props.graphRef == null) {
            return null;
        }
        const origin = this.convertToAbsolutePoint(ORIGIN);
        return (
            <svg height={this.props.graphRef.clientHeight} width={this.props.graphRef.clientWidth}>
                {this.renderPeopleGraphConnections(origin)}
            </svg>
        );
    }

    private renderPeopleGraphConnections(origin: ISingleLocation) {
        return Object.entries(this.props.peopleGraph.connections).map((line) => (
            <RenderLine
                key={line[0]}
                index={line[0]}
                lineSettings={line[1]}
                location={this.convertToAbsolutePoint(this.props.peopleGraph.locations[line[0]])}
                origin={origin}
            />
        ));
    }

    private convertToAbsolutePoint(location: ISingleLocation) {
        if (location == null || this.props.graphRef == null) {
            return {x: 0, y: 0 };
        }
        return {
            x: (this.props.graphRef.clientWidth * location.x / 100),
            y: (this.props.graphRef.clientHeight * location.y / 100),
        };
    }
}

function mapStateToProps(state: IStoreState): IDisplayGraphStoreProps {
    return {
        eventData: state.GoogleReducer.eventData || {},
        graphRef: state.WebsiteReducer.graphRef,
        isAdmin: state.GoogleReducer.isAdmin,
        peopleGraph: selectMainPersonGraph(state),
        userData: state.GoogleReducer.userData || {},
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDisplayGraphDispatchProps {
    return bindActionCreators({
        setGraphRef: SetGraphRef.create,
        setInfoPerson: SetInfoPerson.create,
        setMainPerson: SetMainPerson.create,
    }, dispatch);
}

export const DisplayGraph = connect(mapStateToProps, mapDispatchToProps)(PureDispayGraph);