import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { DatabaseDispatcher } from "../../Dispatchers/DatabaseDispatcher";
import IStoreState from "../../State/IStoreState";
import { SetGraphRef, SetInfoPerson } from "../../State/WebsiteActions";
import { IEventMap } from "../../Types/Events";
import { IUser, IUserMap } from "../../Types/Users";
import { calculateScore } from "../../Utils/GraphHelpers";
import { IPeopleGraph, ISingleLocation, ORIGIN, selectMainPersonGraph } from "../../Utils/selectors";
import User from "../../Utils/User";
import { RenderLine } from "./DisplayGraphHelpers/RenderLine";
import { RenderPerson } from "./DisplayGraphHelpers/RenderPerson";

export interface IDisplayGraphStoreProps {
    currentUser: IUser | undefined;
    eventData: IEventMap | undefined;
    graphRef: HTMLElement | null;
    userData: IUserMap | undefined;
    peopleGraph: IPeopleGraph | undefined;
}

export interface IDisplayGraphDispatchProps {
    getLatestGraph(user: IUser): void;
    setGraphRef(ref: HTMLElement | null): void;
    setInfoPerson(infoPerson: User): void;
}

class PureDispayGraph extends React.Component<IDisplayGraphStoreProps & IDisplayGraphDispatchProps> {
    public componentWillMount() {
        this.changeInfoPerson = this.changeInfoPerson.bind(this);
    }

    public componentDidMount() {
        if (this.props.currentUser !== undefined) {
            this.props.getLatestGraph(this.props.currentUser);
        }
    }

    public setRef = (ref: HTMLElement | null ) => {
        if (this.props.graphRef == null) {
            this.props.setGraphRef(ref);
        }
    }

    public render() {
        const { peopleGraph } = this.props;
        if (peopleGraph === undefined) {
            return null;
        }
        return(
            <div
                id="Graph Container"
                ref={this.setRef}
                className="flexbox-row"
                style={{ position: "relative", width: "100%", height: "100%" }}
            >
                {this.renderMainPerson(peopleGraph)}
                {this.renderMainPersonConnections(peopleGraph)}
                {this.renderConnectionLines(peopleGraph)}
            </div>
        );
    }

    private returnEventDate = (events?: string[]): string | undefined => {
        if (this.props.eventData === undefined || events === undefined || events.length === 0) {
            return undefined;
        }
        console.log(this.props.eventData);
        return this.props.eventData[events.slice(-1)[0]].date;
    }

    private renderMainPerson(peopleGraph: IPeopleGraph) {
        return (
            <RenderPerson
                changeInfoPerson={this.changeInfoPerson}
                dimension={peopleGraph.dimension}
                location={ORIGIN}
                scoreTally={{ isMain: true }}
                user={peopleGraph.mainPerson}
            />
        );
    }

    private renderMainPersonConnections(peopleGraph: IPeopleGraph) {
        const { mainPerson } = peopleGraph;
        if (mainPerson.connections === undefined) {
            return null;
        }

        return Object.keys(mainPerson.connections).map((userID: string) => {
            const user = this.props.userData;
            if (user === undefined || mainPerson.connections === undefined) {
                return null;
            }
            const eventDate = this.returnEventDate(mainPerson.connections[userID]);
            return (
                <RenderPerson
                    changeInfoPerson={this.changeInfoPerson}
                    dimension={peopleGraph.dimension}
                    key={`${mainPerson.id}_${userID}`}
                    lastEventDate={eventDate}
                    location={peopleGraph.locations[userID]}
                    scoreTally={calculateScore(user[userID], peopleGraph.mainPerson)}
                    user={user[userID]}
                />
            );
        });
    }

    private changeInfoPerson(user: User) {
        return () => this.props.setInfoPerson(user);
    }

    private renderConnectionLines(peopleGraph: IPeopleGraph) {
        if (this.props.graphRef == null) {
            return null;
        }
        const origin = this.convertToAbsolutePoint(ORIGIN);
        return (
            <svg height={this.props.graphRef.clientHeight} width={this.props.graphRef.clientWidth}>
                {this.renderPeopleGraphConnections(origin, peopleGraph)}
            </svg>
        );
    }

    private renderPeopleGraphConnections(origin: ISingleLocation, peopleGraph: IPeopleGraph) {
        return Object.entries(peopleGraph.connections).map((line) => (
            <RenderLine
                key={line[0]}
                index={line[0]}
                lineSettings={line[1]}
                location={this.convertToAbsolutePoint(peopleGraph.locations[line[0]])}
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
        currentUser: state.DatabaseReducer.currentUser,
        eventData: state.DatabaseReducer.eventData,
        graphRef: state.WebsiteReducer.graphRef,
        peopleGraph: selectMainPersonGraph(state),
        userData: state.DatabaseReducer.userData,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDisplayGraphDispatchProps {
    return {
        ...bindActionCreators({
            setGraphRef: SetGraphRef.create,
            setInfoPerson: SetInfoPerson.create,
        }, dispatch),
        getLatestGraph: new DatabaseDispatcher(dispatch).getLatestGraph,
    }
}

export const DisplayGraph = connect(mapStateToProps, mapDispatchToProps)(PureDispayGraph);
