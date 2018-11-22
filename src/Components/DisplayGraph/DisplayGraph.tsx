import * as d3 from "d3";
import { debounce } from "lodash-es";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import IStoreState from "../../State/IStoreState";
import {
  SetContextMenuNode,
  SetGraphRef,
  SetInfoPerson
} from "../../State/WebsiteActions";
import { IUser } from "../../Types/Users";
import {
  ALL_VALID_CATEGORIES,
  IPeopleGraph,
  selectMainPersonGraph
} from "../../Utils/selectors";
import { GraphContextMenu } from "./ContextMenu";
import { DisplayGraphHelpers } from "./DisplayGraphHelpers";
import {
  DEFAULT_RADIUS,
  HALF_DEFAULT,
  maybeApplyLinkForce,
  returnBoundRectangle,
  returnDragDrop,
  returnLinkElements,
  returnNames,
  returnNodeElements,
  returnRelationshipElements,
  returnSimulation,
  zoomToNode
} from "./DisplayGraphUtils";

import "./DisplayGraph.scss";

export interface IDisplayGraphStoreProps {
  currentUser: IUser | undefined;
  graphRef: HTMLElement | null;
  peopleGraph: IPeopleGraph | undefined;
}

export interface IDisplayGraphDispatchProps {
  setContextNode(node: IUser | undefined): void;
  setGraphRef(ref: HTMLElement | null): void;
  setInfoPerson(infoPerson: IUser): void;
}

export interface IGraphUser extends IUser {
  vx: number;
  vy: number;
  x: number;
  y: number;
}

const INITIAL_ZOOM_DELAY = 250;

class PureDispayGraph extends React.PureComponent<
  IDisplayGraphStoreProps & IDisplayGraphDispatchProps
> {
  private hasZoomedToUser = false;

  public setRef = (ref: HTMLElement | null) => {
    if (ref == null) {
      return;
    }
    this.props.setGraphRef(ref);
  };

  public componentDidMount() {
    window.addEventListener("resize", debounce(this.refreshGraph, 1500));
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", debounce(this.refreshGraph, 1500));
  }

  public refreshGraph = () => {
    const { graphRef } = this.props;
    if (graphRef == null) {
      return;
    }
    this.renderD3Graph(
      graphRef.clientWidth,
      graphRef.clientHeight,
      this.props.peopleGraph
    );
  };

  public componentDidUpdate(
    previousProps: IDisplayGraphStoreProps & IDisplayGraphDispatchProps
  ) {
    const { graphRef } = this.props;
    if (
      graphRef === null ||
      this.props.peopleGraph === previousProps.peopleGraph
    ) {
      return;
    }
    this.renderD3Graph(
      graphRef.clientWidth,
      graphRef.clientHeight,
      this.props.peopleGraph
    );

    if (!this.hasZoomedToUser) {
      this.zoomToCurrentUser();
      this.hasZoomedToUser = true;
    }
  }

  public render() {
    return (
      <div
        id="Graph Container"
        ref={this.setRef}
        className="d3-graph-container"
      >
        <DisplayGraphHelpers zoomToNode={this.zoomToNode} />
        <GraphContextMenu onZoomClick={this.zoomToNode} />
        <svg
          id="graph"
          className="d3-graph"
          onContextMenu={this.disableContextMenu}
        />
      </div>
    );
  }

  private disableContextMenu = (event: React.MouseEvent<SVGElement>) =>
    event.preventDefault();

  private zoomToCurrentUser() {
    const { currentUser } = this.props;
    if (currentUser === undefined) {
      return;
    }
    setTimeout(() => {
      this.zoomToNode(currentUser, 0.5);
    }, INITIAL_ZOOM_DELAY);
  }

  private zoomToNode = (node: IUser | IGraphUser, zoomAmount: number = 2.5) => {
    zoomToNode(node.id, zoomAmount);
    this.props.setInfoPerson(node);
  };

  private handleClick = (node: IUser) => this.props.setInfoPerson(node);
  private handleContextMenu = (node: IUser) => this.props.setContextNode(node);

  private runSimulation(
    svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
    peopleGraph: IPeopleGraph,
    simulation: d3.Simulation<{}, undefined>
  ) {
    const linkElements = returnLinkElements(svg, peopleGraph.links);
    returnBoundRectangle(svg, () => {
      const zoomToPersonTransform =
        d3.event.detail && d3.event.detail.transform;
      if (zoomToPersonTransform === undefined) {
        linkElements.attr("transform", d3.event.transform);
        nodeElements.attr("transform", d3.event.transform);
        relationshipElements.attr("transform", d3.event.transform);
        names.attr("transform", d3.event.transform);
        return;
      }
      linkElements
        .transition()
        .duration(500)
        .attr("transform", zoomToPersonTransform);
      nodeElements
        .transition()
        .duration(500)
        .attr("transform", zoomToPersonTransform);
      relationshipElements
        .transition()
        .duration(500)
        .attr("transform", zoomToPersonTransform);
      names
        .transition()
        .duration(500)
        .attr("transform", zoomToPersonTransform);
    });
    const relationshipElements = returnRelationshipElements(
      svg,
      peopleGraph.nodes,
      peopleGraph.relationships
    );
    const nodeElements = returnNodeElements(
      svg,
      peopleGraph.nodes,
      peopleGraph.lastEvents,
      this.props.currentUser,
      this.handleClick
    );
    const names = returnNames(
      svg,
      peopleGraph.nodes,
      this.handleClick,
      this.handleContextMenu
    );

    simulation.nodes(peopleGraph.nodes).on("tick", () => {
      ALL_VALID_CATEGORIES.forEach((relationshipType, index) => {
        relationshipElements
          .selectAll(`.${relationshipType}`)
          .attr("cx", (node: any) => node.x - 10)
          .attr("cy", (node: any) => node.y + HALF_DEFAULT / 4 + 12 * index);
      });
      nodeElements
        .attr("x", (node: any) => node.x)
        .attr("y", (node: any) => node.y);
      names.attr("x", (node: any) => node.x).attr("y", (node: any) => node.y);
      linkElements
        .attr("x1", (link: any) => link.source.x + DEFAULT_RADIUS)
        .attr("y1", (link: any) => link.source.y + HALF_DEFAULT)
        .attr("x2", (link: any) => link.target.x + DEFAULT_RADIUS)
        .attr("y2", (link: any) => link.target.y + HALF_DEFAULT);
    });

    relationshipElements.call(returnDragDrop(simulation) as any);
    nodeElements.call(returnDragDrop(simulation) as any);
    names.call(returnDragDrop(simulation) as any);

    maybeApplyLinkForce(simulation, peopleGraph.links);
  }

  private renderD3Graph(
    width: number,
    height: number,
    peopleGraph: IPeopleGraph | undefined
  ) {
    if (peopleGraph === undefined) {
      return;
    }

    const svg = d3
      .select("#graph")
      .attr("width", width)
      .attr("height", height);
    svg.selectAll("*").remove();
    const simulation = returnSimulation(width, height);
    simulation.restart();

    this.runSimulation(svg, peopleGraph, simulation);
  }
}

function mapStateToProps(state: IStoreState): IDisplayGraphStoreProps {
  return {
    currentUser: state.DatabaseReducer.currentUser,
    graphRef: state.WebsiteReducer.graphRef,
    peopleGraph: selectMainPersonGraph(state)
  };
}

function mapDispatchToProps(dispatch: Dispatch): IDisplayGraphDispatchProps {
  return bindActionCreators(
    {
      setContextNode: SetContextMenuNode.create,
      setGraphRef: SetGraphRef.create,
      setInfoPerson: SetInfoPerson.create
    },
    dispatch
  );
}

export const DisplayGraph = connect(
  mapStateToProps,
  mapDispatchToProps
)(PureDispayGraph);
