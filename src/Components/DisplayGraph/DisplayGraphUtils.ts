import classNames from "classnames";
import * as d3 from "d3";

import { ILink } from "../../Types/Graph";
import { IUser } from "../../Types/Users";
import {
  ALL_VALID_CATEGORIES,
  IRelationship,
  IValidCategories
} from "../../Utils/selectors";
import { getDifferenceBetweenDates } from "../../Utils/Util";

const CHARGE_STRENGTH = -75;
const GRAPH_ID = "BOUNDING_RECTANGLE";

export const GREEN_DAYS = 30;
export const RED_DAYS = 90;

export const DEFAULT_RADIUS = 30;
export const HALF_DEFAULT = DEFAULT_RADIUS / 2;

const ZOOM_TO_PERSON = "ZOOM_TO_PERSON";

export function returnBoundRectangle(
  svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
  zoomed: () => void
) {
  const handleZoom = d3
    .zoom()
    .scaleExtent([1 / 5, 1])
    .on("zoom", zoomed);
  const width = (svg.node() as any).getBoundingClientRect().width;
  const height = (svg.node() as any).getBoundingClientRect().height;

  return (
    svg
      .append("rect")
      .attr("id", GRAPH_ID)
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      /* For zooming and panning */
      .style("pointer-events", "all")
      .call(handleZoom as any)
      .on(ZOOM_TO_PERSON, zoomed)
  );
}

export function returnDragDrop(simulation: d3.Simulation<{}, undefined>) {
  return d3
    .drag()
    .on("start", (node: any) => {
      node.fx = node.x;
      node.fy = node.y;
    })
    .on("drag", (node: any) => {
      simulation.alphaTarget(0.7).restart();
      node.fx = d3.event.x;
      node.fy = d3.event.y;
    })
    .on("end", (node: any) => {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      node.fx = null;
      node.fy = null;
    });
}

export function returnLinkElements(
  svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
  links: ILink[]
) {
  return svg
    .append("g")
    .selectAll(".link")
    .exit()
    .remove()
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke", (link: ILink) => link.color || "black")
    .attr("opacity", (link: ILink) => link.opacity || 0.1)
    .attr("stroke-width", (link: ILink) => link.strokeWidth || 1);
}

export function returnSimulation(width: number, height: number) {
  const simulation = d3
    .forceSimulation()
    .force("charge", d3.forceManyBody().strength(CHARGE_STRENGTH))
    .force("center", d3.forceCenter(width / 2, height / 2));
  simulation.force(
    "link",
    d3
      .forceLink()
      .id((link: any) => link.id)
      .strength(link => (link as ILink).strength)
      .distance(link => (link as ILink).distance)
      .iterations(2)
  );
  return simulation;
}

export function maybeApplyLinkForce(
  simulation: d3.Simulation<{}, undefined>,
  links: ILink[]
) {
  const linkForce: any = simulation.force("link");
  if (linkForce === undefined) {
    return;
  }
  linkForce.links(links);
}

function returnFill(id: string, map: Map<string, Date>) {
  const lastTime = map.get(id);
  if (lastTime === undefined) {
    return "gray";
  }

  const totalDifference = getDifferenceBetweenDates(
    new Date(),
    new Date(lastTime)
  );
  if (totalDifference < 0) {
    return "blue";
  } else if (totalDifference < GREEN_DAYS) {
    return "green";
  } else if (totalDifference < RED_DAYS) {
    return "yellow";
  } else {
    return "red";
  }
}

const getNameLength = (name: string) =>
  Math.min(
    Math.max((name.split(" ")[0].length + 1) * 10, DEFAULT_RADIUS * 2),
    DEFAULT_RADIUS * 4
  );

export function returnNodeElements(
  svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
  nodes: IUser[],
  lastEvents: Map<string, Date>,
  currentUser: IUser | undefined,
  handleClick: (node: IUser) => void
) {
  if (currentUser === undefined) {
    throw new Error("Tried to fetch an undefined current user in graph");
  }
  return svg
    .append("g")
    .selectAll(".node")
    .exit()
    .remove()
    .data(nodes)
    .enter()
    .append("rect")
    .attr("height", DEFAULT_RADIUS)
    .attr("width", (node: IUser) => getNameLength(node.name))
    .attr("rx", 5)
    .attr("ry", 5)
    .on("click", handleClick)
    .attr("class", (node: IUser) =>
      classNames("node", returnFill(node.id, lastEvents))
    )
    .attr("id", (node: IUser) => `NODE_${node.id}`);
}

function relationshipIncludes(
  id: string,
  relationships: IRelationship,
  key: IValidCategories
) {
  const allRelationships = relationships.get(id);
  if (allRelationships === undefined) {
    return false;
  }
  return allRelationships.includes(key);
}

export function returnRelationshipElements(
  svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
  nodes: IUser[],
  relationships: IRelationship
) {
  const allRelationships = svg
    .append("g")
    .selectAll(".relationship")
    .exit()
    .remove()
    .data(nodes)
    .enter()
    .append("g");
  ALL_VALID_CATEGORIES.forEach(relationshipType => {
    allRelationships
      .filter(node =>
        relationshipIncludes(node.id, relationships, relationshipType)
      )
      .append("circle")
      .attr("r", 5)
      .attr("class", classNames("relationship", relationshipType));
  });
  return allRelationships;
}

export function returnNames(
  svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>,
  nodes: IUser[],
  handleClick: (node: IUser) => void,
  handleContextMenu: (node: IUser) => void
) {
  return svg
    .append("g")
    .selectAll("text")
    .exit()
    .remove()
    .data(nodes)
    .enter()
    .append("text")
    .text(node => {
      const name = node.name.split(" ");
      return name.length > 1 ? `${name[0]} ${name[1][0]}.` : name[0];
    })
    .attr("dx", (node: IUser) => getNameLength(node.name) / 2)
    .attr("dy", HALF_DEFAULT)
    .attr("dominant-baseline", "middle")
    .on("click", handleClick)
    .on("contextmenu", (node: IUser) => {
      d3.event.preventDefault();
      handleContextMenu(node);
    })
    .attr("class", "name");
}

export function zoomToNode(id: string, zoomAmount: number) {
  const selectedNode = d3.select(`[id="NODE_${id}"]`);
  if (selectedNode == null || selectedNode.size() === 0) {
    return;
  }

  d3.select(`#${GRAPH_ID}`)
    .call(
      d3.zoom().translateTo as any,
      parseInt(selectedNode.attr("x"), 10),
      parseInt(selectedNode.attr("y"), 10)
    )
    .call(d3.zoom().scaleTo as any, zoomAmount)
    .dispatch(ZOOM_TO_PERSON, {
      detail: {
        transform: d3.zoomTransform(d3.select(`#${GRAPH_ID}`).node() as any)
      }
    } as any);
}

export function zoomByScale(zoomPercentage: number) {
  d3.select(`#${GRAPH_ID}`)
    .call(d3.zoom().scaleBy as any, zoomPercentage)
    .dispatch(ZOOM_TO_PERSON, {
      detail: {
        transform: d3.zoomTransform(d3.select(`#${GRAPH_ID}`).node() as any)
      }
    } as any);
}
