import * as d3 from "d3";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { DatabaseDispatcher } from "../../Dispatchers/DatabaseDispatcher";
import IStoreState from "../../State/IStoreState";
import { SetGraphRef, SetInfoPerson } from "../../State/WebsiteActions";
import { IUser } from "../../Types/Users";
import { IDateMap, ILink, IPeopleGraph, selectMainPersonGraph } from "../../Utils/selectors";

import "./DisplayGraph.css";

export interface IDisplayGraphStoreProps {
    currentUser: IUser | undefined;
    graphRef: HTMLElement | null;
    peopleGraph: IPeopleGraph | undefined;
}

export interface IDisplayGraphDispatchProps {
    getLatestGraph(user: IUser): void;
    setGraphRef(ref: HTMLElement | null): void;
    setInfoPerson(infoPerson: IUser): void;
}

const GREEN_DAYS = 30;
const YELLOW_DAYS = 90;

const GRAY = "#839192";
const RED = "#F1948A";
const YELLOW = "#F7DC6F";
const GREEN = "#7DCEA0";

const CHARGE_STRENGTH = -200;

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const DEFAULT_RADIUS = 12;
const MAIN_PERSON_RADIUS = DEFAULT_RADIUS * 1.5;

class PureDispayGraph extends React.Component<IDisplayGraphStoreProps & IDisplayGraphDispatchProps> {
    private hasRenderedGraph = false;

    public componentDidMount() {
        if (this.props.currentUser !== undefined) {
            this.props.getLatestGraph(this.props.currentUser);
        }
    }

    public setRef = (ref: HTMLElement | null ) => {
        if (this.props.graphRef == null && ref !== null) {
            this.props.setGraphRef(ref);
        }
    }
    
    public componentWillReceiveProps(nextProps: IDisplayGraphStoreProps & IDisplayGraphDispatchProps) {
        if (nextProps.graphRef !== null) {
            this.renderD3Graph(nextProps.graphRef.clientWidth, nextProps.graphRef.clientHeight, nextProps.peopleGraph);
        }
    }

    public render() {
        return(
            <div
                id="Graph Container"
                ref={this.setRef}
                className="d3-graph-container"
            >
                <svg id="graph" className="d3-graph" />
            </div>
        );
    }

    private handleClick = (node: IUser) => {
        this.props.setInfoPerson(node)
    }

    private renderBorderColor(id: string, map: IDateMap) {
        const lastTime = map[id];
        if (lastTime === undefined) {
            return GRAY;
        }

        const totalDifference = (new Date().getTime() - new Date(lastTime).getTime()) / MILLISECONDS_PER_DAY;
        if (totalDifference < GREEN_DAYS) {
            return GREEN;
        } else if (totalDifference < YELLOW_DAYS) {
            return YELLOW;
        } else {
            return RED;
        }
    }

    private returnSimulation(width: number, height: number) {
        const simulation = d3.forceSimulation()
            .force("charge", d3.forceManyBody().strength(CHARGE_STRENGTH))
            .force("center", d3.forceCenter(width / 2, height / 2));
        simulation.force("link", d3.forceLink().id((link: any) => link.id).strength((link: ILink) => link.strength).distance((link: ILink) => link.distance));
        return simulation;
    }
    
    private returnBoundRectangle(svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>, zoomed: () => void) {
        return svg.append("rect")
            .attr("width", (svg.node() as any).getBoundingClientRect().width)
            .attr("height", (svg.node() as any).getBoundingClientRect().height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .call(d3.zoom().scaleExtent([ 1 / 4, 4 ]).on("zoom", zoomed));
    }

    private returnLinkElements(svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>, links: ILink[]) {
        return svg.append("g")
            .selectAll("line")
            .data(links)
            .enter().append("line")
                .attr("class", "connection-line");
    }

    private returnNodeElements(svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>, nodes: IUser[], lastEvents: IDateMap) {
        const { currentUser } = this.props;
        if (currentUser === undefined) {
            throw new Error("Tried to fetch an undefined current user in graph");
        }
        return svg.append("g")
            .selectAll("circle")
            .data(nodes)
            .enter().append("circle")
                .attr("r", (node: IUser) => node.id === currentUser.id ? MAIN_PERSON_RADIUS : DEFAULT_RADIUS)
                .attr("fill", node => this.renderBorderColor(node.id, lastEvents))
                .on("click", this.handleClick)
                .attr("class", "node");
    }

    private returnNames(svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>, nodes: IUser[]) {
        return svg.append("g")
            .selectAll("text")
            .data(nodes)
            .enter().append("text")
                .text(node => {
                    const name = node.name.split(" ");
                    return name.length > 1 ? `${name[0]} ${name[1][0]}` : name[0];
                })
                .attr("dx", (node) => -((node.name.split(" ")[0]).length + 2) * 3.5)
                .attr("dy", 5)
                .on("click", this.handleClick)
                .attr("class", "name");
    }

    private returnDragDrop(simulation: d3.Simulation<{}, undefined>) {
        return d3.drag()
            .on("start", (node: any) => { node.fx = node.x; node.fy = node.y })
            .on("drag", (node: any) => { simulation.alphaTarget(0.7).restart(); node.fx = d3.event.x; node.fy = d3.event.y })
            .on("end", (node: any) => { if (!d3.event.active){ simulation.alphaTarget(0) }; node.fx = null; node.fy = null } );
    }

    private maybeApplyLinkForce(simulation: d3.Simulation<{}, undefined>, links: ILink[]) {
        const linkForce: any = simulation.force("link");
        if (linkForce === undefined) {
            return;
        }
        linkForce.links(links);
    }

    private runSimulation(svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>, peopleGraph: IPeopleGraph, simulation: d3.Simulation<{}, undefined>) {
        const linkElements = this.returnLinkElements(svg, peopleGraph.links);
        this.returnBoundRectangle(svg, () => {
            linkElements.attr("transform", d3.event.transform);
            nodeElements.attr("transform", d3.event.transform);
            names.attr("transform", d3.event.transform);
        });
        const nodeElements = this.returnNodeElements(svg, peopleGraph.nodes, peopleGraph.lastEvents);
        const names = this.returnNames(svg, peopleGraph.nodes);
        
        simulation.nodes(peopleGraph.nodes).on("tick", () => {
            nodeElements
                .attr("cx", (node: any) => node.x)
                .attr("cy", (node: any) => node.y);
            names
                .attr("x", (node: any) => node.x)
                .attr("y", (node: any) => node.y);
            linkElements
                .attr("x1", (link: any) => link.source.x)
                .attr('y1', (link: any) => link.source.y)
                .attr('x2', (link: any) => link.target.x)
                .attr('y2', (link: any) => link.target.y);
        });

        nodeElements.call(this.returnDragDrop(simulation) as any);
        names.call(this.returnDragDrop(simulation) as any);

        this.maybeApplyLinkForce(simulation, peopleGraph.links);
    }

    private renderD3Graph(width: number, height: number, peopleGraph: IPeopleGraph | undefined ) {
        if (peopleGraph === undefined || this.hasRenderedGraph) {
            return;
        }
        this.hasRenderedGraph = true;

        const svg = d3.select("#graph").attr("width", width).attr("height", height);
        const simulation = this.returnSimulation(width, height);

        this.runSimulation(svg, peopleGraph, simulation);
    }
}

function mapStateToProps(state: IStoreState): IDisplayGraphStoreProps {
    return {
        currentUser: state.DatabaseReducer.currentUser,
        graphRef: state.WebsiteReducer.graphRef,
        peopleGraph: selectMainPersonGraph(state),
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
