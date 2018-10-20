import * as d3 from "d3";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Button } from "@blueprintjs/core";

import IStoreState from "../../State/IStoreState";
import { SetGraphRef, SetInfoPerson } from "../../State/WebsiteActions";
import { IUser, IUserMap } from "../../Types/Users";
import { IPeopleGraph, selectMainPersonGraph } from "../../Utils/selectors";
import { Autocomplete } from "../Common/Autocomplete";
import { maybeApplyLinkForce, returnBoundRectangle, returnDragDrop, returnLinkElements, returnNames, returnNodeElements, returnSimulation, zoomByScale, zoomToNode } from "./DisplayGraphUtils";

import "./DisplayGraph.css";

export interface IDisplayGraphStoreProps {
    currentUser: IUser | undefined;
    graphRef: HTMLElement | null;
    peopleGraph: IPeopleGraph | undefined;
    userMap: IUserMap | undefined;
}

export interface IDisplayGraphDispatchProps {
    setGraphRef(ref: HTMLElement | null): void;
    setInfoPerson(infoPerson: IUser): void;
}

const INITIAL_ZOOM_DELAY = 250;

class PureDispayGraph extends React.Component<IDisplayGraphStoreProps & IDisplayGraphDispatchProps> {
    public setRef = (ref: HTMLElement | null ) => {
        if (this.props.graphRef != null || ref === null) {
            return;
        }
        this.props.setGraphRef(ref);
    }
    
    public componentWillReceiveProps(nextProps: IDisplayGraphStoreProps & IDisplayGraphDispatchProps) {
        if (nextProps.graphRef === null || this.props.peopleGraph === nextProps.peopleGraph) {
            return;
        }
        this.renderD3Graph(nextProps.graphRef.clientWidth, nextProps.graphRef.clientHeight, nextProps.peopleGraph);
        this.zoomToCurrentUser();
    }

    public render() {
        return(
            <div
                id="Graph Container"
                ref={this.setRef}
                className="d3-graph-container"
            >
                <div className="graph-helpers">
                    <Autocomplete
                        className="find-user-autocomplete"
                        dataSource={this.props.userMap}
                        displayKey="name"
                        placeholderText="Search for user…"
                        onSelection={this.zoomToNode}
                    />
                    <div className="graph-assistant-buttons">
                        <Button
                            className="zoom-in-button"
                            icon="zoom-in"
                            onClick={this.zoomIn}
                        />
                        <Button
                            className="zoom-in-button"
                            icon="zoom-out"
                            onClick={this.zoomOut}
                        />
                        <Button
                            className="reset-graph-button"
                            icon="locate"
                            onClick={this.resetGraph}
                        />
                    </div>
                </div>
                <svg id="graph" className="d3-graph" />
            </div>
        );
    }

    private zoomIn = () => zoomByScale(1.25);
    private zoomOut = () => zoomByScale(0.75);

    private resetGraph = () => {
        const { graphRef } = this.props;
        if (graphRef === null) {
            return;
        }
        this.renderD3Graph(graphRef.clientWidth, graphRef.clientHeight, this.props.peopleGraph);
    }

    private zoomToCurrentUser() {
        const { currentUser } = this.props;
        if (currentUser === undefined) {
            return;
        }
        setTimeout(() => {
            this.zoomToNode(currentUser, 0.7);
        }, INITIAL_ZOOM_DELAY);
    }

    private zoomToNode = (node: IUser, zoomAmount: number = 2.5) => {
        zoomToNode(node.id, zoomAmount);
        this.props.setInfoPerson(node);
    }

    private handleClick = (node: IUser) => this.props.setInfoPerson(node);

    private runSimulation(svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>, peopleGraph: IPeopleGraph, simulation: d3.Simulation<{}, undefined>) {
        const linkElements = returnLinkElements(svg, peopleGraph.links);
        returnBoundRectangle(svg, () => {
            const zoomToPersonTransform = d3.event.detail && d3.event.detail.transform
            if (zoomToPersonTransform === undefined) {
                linkElements.attr("transform", d3.event.transform);
                nodeElements.attr("transform", d3.event.transform);
                names.attr("transform", d3.event.transform);
                return;
            }
            linkElements.transition().duration(500).attr("transform", zoomToPersonTransform);
            nodeElements.transition().duration(500).attr("transform", zoomToPersonTransform);
            names.transition().duration(500).attr("transform", zoomToPersonTransform);
        });
        const nodeElements = returnNodeElements(svg, peopleGraph.nodes, peopleGraph.lastEvents, this.props.currentUser, this.handleClick);
        const names = returnNames(svg, peopleGraph.nodes, this.handleClick);
        
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

        nodeElements.call(returnDragDrop(simulation) as any);
        names.call(returnDragDrop(simulation) as any);

        maybeApplyLinkForce(simulation, peopleGraph.links);
    }

    private renderD3Graph(width: number, height: number, peopleGraph: IPeopleGraph | undefined) {
        if (peopleGraph === undefined) {
            return;
        }

        const svg = d3.select("#graph").attr("width", width).attr("height", height);
        svg.selectAll("*").remove();
        const simulation = returnSimulation(width, height);

        this.runSimulation(svg, peopleGraph, simulation);
    }
}

function mapStateToProps(state: IStoreState): IDisplayGraphStoreProps {
    return {
        currentUser: state.DatabaseReducer.currentUser,
        graphRef: state.WebsiteReducer.graphRef,
        peopleGraph: selectMainPersonGraph(state),
        userMap: state.DatabaseReducer.userData,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDisplayGraphDispatchProps {
    return bindActionCreators({
            setGraphRef: SetGraphRef.create,
            setInfoPerson: SetInfoPerson.create,
        }, dispatch)
}

export const DisplayGraph = connect(mapStateToProps, mapDispatchToProps)(PureDispayGraph);
