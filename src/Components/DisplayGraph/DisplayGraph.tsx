import * as d3 from "d3";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { DatabaseDispatcher } from "../../Dispatchers/DatabaseDispatcher";
import IStoreState from "../../State/IStoreState";
import { SetGraphRef, SetInfoPerson } from "../../State/WebsiteActions";
import { IEventMap } from "../../Types/Events";
import { IUser, IUserMap } from "../../Types/Users";
import { IDateMap, ILink, IPeopleGraph, selectMainPersonGraph } from "../../Utils/selectors";

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
    setInfoPerson(infoPerson: IUser): void;
}

const GREEN_DAYS = 30;
const YELLOW_DAYS = 90;

const BLACK = "#1B2631";
const RED = "#F1948A";
const YELLOW = "#F7DC6F";
const GREEN = "#7DCEA0";

class PureDispayGraph extends React.Component<IDisplayGraphStoreProps & IDisplayGraphDispatchProps> {
    public componentDidMount() {
        if (this.props.currentUser !== undefined) {
            this.props.getLatestGraph(this.props.currentUser);
        }
    }

    public setRef = (ref: HTMLElement | null ) => {
        if (this.props.graphRef == null && ref !== null) {
            this.props.setGraphRef(ref);
            this.renderD3Graph(ref.clientWidth, ref.clientHeight);
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
                <svg id="graph" />
            </div>
        );
    }

    private handleClick = (node: IUser) => {
        this.props.setInfoPerson(node)
    }

    private renderBorderColor(id: string, map: IDateMap) {
        const lastTime = map[id];
        if (lastTime === undefined) {
            return BLACK;
        }

        const totalDifference = (new Date().getTime() - new Date(lastTime).getTime()) / (1000 * 60 * 60 * 24);
        if (totalDifference < GREEN_DAYS) {
            return GREEN;
        } else if (totalDifference < YELLOW_DAYS) {
            return YELLOW;
        } else {
            return RED;
        }
    }

    private renderD3Graph(width: number, height: number) {
        const { peopleGraph } = this.props;
        if (peopleGraph === undefined) {
            return;
        }

        const svg = d3.select("#graph").attr("width", width).attr("height", height);

        const simulation = d3.forceSimulation().force("charge", d3.forceManyBody().strength(-75)).force("center", d3.forceCenter(width / 2, height / 2));
        simulation.force("link", d3.forceLink().id((link: any) => link.id).strength((link: ILink) => link.strength));

        const linkElements = svg.append("g").selectAll("line").data(peopleGraph.links).enter().append("line").attr("stroke-width", 1).attr("stroke", "black").attr("opacity", 0.1).attr("user-select", "none");
        const nodeElements = svg.append("g").selectAll("circle").data(peopleGraph.nodes).enter().append("circle").attr("r", 12).attr("fill", node => node.gender === "M" ? "#2874A6" : "#B03A2E").attr("cursor", "pointer").on("click", this.handleClick).attr("user-select", "none").attr("stroke-width", 3).attr("stroke", node => this.renderBorderColor(node.id, peopleGraph.lastEvents));
        const firstNames = svg.append("g").selectAll("text").data(peopleGraph.nodes).enter().append("text").text(node => node.name.split(" ")[0]).attr("font-size", 10).attr("dy", -5).attr("cursor", "pointer").attr("user-select", "none").on("click", this.handleClick);
        const lastNames = svg.append("g").selectAll("text").data(peopleGraph.nodes).enter().append("text").text(node => node.name.split(" ")[1]).attr("font-size", 13).attr("dy", 5).attr("cursor", "pointer").attr("user-select", "none").on("click", this.handleClick);
        
        simulation.nodes(peopleGraph.nodes).on("tick", () => {
            nodeElements.attr("cx", (node: any) => node.x).attr("cy", (node: any) => node.y);
            firstNames.attr("x", (node: any) => node.x).attr("y", (node: any) => node.y);
            lastNames.attr("x", (node: any) => node.x).attr("y", (node: any) => node.y);
            linkElements.attr("x1", (link: any) => link.source.x).attr('y1', (link: any) => link.source.y).attr('x2', (link: any) => link.target.x).attr('y2', (link: any) => link.target.y)
        });

        const dragDrop: any = d3.drag().on("start", (node: any) => { node.fx = node.x; node.fy = node.y }).on("drag", (node: any) => { simulation.alphaTarget(0.7).restart(); node.fx = d3.event.x; node.fy = d3.event.y }).on("end", (node: any) => { if (!d3.event.active){ simulation.alphaTarget(0) }; node.fx = null; node.fy = null } )
        nodeElements.call(dragDrop);

        const linkForce: any = simulation.force("link");
        if (linkForce === undefined) {
            return;
        }
        linkForce.links(peopleGraph.links);
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
