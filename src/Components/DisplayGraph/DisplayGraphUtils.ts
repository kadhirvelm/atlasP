import * as d3 from "d3";

import { ILink } from "../../Types/Graph";
import { IUser } from "../../Types/Users";
import { IDateMap } from "../../Utils/selectors";
import { getDifferenceBetweenDates } from "../../Utils/Util";

const CHARGE_STRENGTH = -200;
const GRAPH_ID = "BOUNDING_RECTANGLE";

export const GREEN_DAYS = 30;
export const RED_DAYS = 90;

const GRAY = "#839192";
const RED = "#F1948A";
const YELLOW = "#F7DC6F";
const GREEN = "#7DCEA0";
const BLUE = "#7FB3D5";

const DEFAULT_RADIUS = 12;
const MAIN_PERSON_RADIUS = DEFAULT_RADIUS * 1.5;

const ZOOM_TO_PERSON = "ZOOM_TO_PERSON";

export function returnBoundRectangle(svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>, zoomed: () => void) {
    const handleZoom = d3.zoom().scaleExtent([ 1 / 5, 1 ]).on("zoom", zoomed);
    const width = (svg.node() as any).getBoundingClientRect().width;
    const height = (svg.node() as any).getBoundingClientRect().height;

    return svg.append("rect")
        .attr("id", GRAPH_ID)
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        /* For zooming and panning */
        .style("pointer-events", "all")
        .call(handleZoom)
        .on(ZOOM_TO_PERSON, zoomed);
}

export function returnDragDrop(simulation: d3.Simulation<{}, undefined>) {
    return d3.drag()
        .on("start", (node: any) => { node.fx = node.x; node.fy = node.y })
        .on("drag", (node: any) => { simulation.alphaTarget(0.7).restart(); node.fx = d3.event.x; node.fy = d3.event.y })
        .on("end", (node: any) => { if (!d3.event.active){ simulation.alphaTarget(0) }; node.fx = null; node.fy = null } );
}

export function returnLinkElements(svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>, links: ILink[]) {
    return svg.append("g")
        .selectAll("line")
        .exit().remove()
        .data(links)
        .enter().append("line")
            .attr("class", "connection-line")
}

export function returnSimulation(width: number, height: number) {
    const simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(CHARGE_STRENGTH))
        .force("center", d3.forceCenter(width / 2, height / 2));
    simulation.force("link", d3.forceLink().id((link: any) => link.id).strength((link: ILink) => link.strength).distance((link: ILink) => link.distance).iterations(2));
    return simulation;
}

export function returnFill(id: string, map: IDateMap) {
    const lastTime = map[id];
    if (lastTime === undefined) {
        return GRAY;
    }

    const totalDifference = getDifferenceBetweenDates(new Date(), new Date(lastTime));
    if (totalDifference < 0) {
        return BLUE;
    } else if (totalDifference < GREEN_DAYS) {
        return GREEN;
    } else if (totalDifference < RED_DAYS) {
        return YELLOW;
    } else {
        return RED;
    }
}

export function maybeApplyLinkForce(simulation: d3.Simulation<{}, undefined>, links: ILink[]) {
    const linkForce: any = simulation.force("link");
    if (linkForce === undefined) {
        return;
    }
    linkForce.links(links);
}

export function returnNodeElements(svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>, nodes: IUser[], lastEvents: IDateMap, currentUser: IUser | undefined, handleClick: (node: IUser) => void) {
    if (currentUser === undefined) {
        throw new Error("Tried to fetch an undefined current user in graph");
    }
    return svg.append("g")
        .selectAll("circle")
        .exit().remove()
        .data(nodes)
        .enter().append("circle")
            .attr("r", (node: IUser) => node.id === currentUser.id ? MAIN_PERSON_RADIUS : DEFAULT_RADIUS)
            .attr("fill", (node: IUser) => returnFill(node.id, lastEvents))
            .on("click", handleClick)
            .attr("class", "node")
            .attr("id", (node: IUser) => node.id);
}

export function returnNames(svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>, nodes: IUser[], handleClick: (node: IUser) => void) {
    return svg.append("g")
        .selectAll("text")
        .exit().remove()
        .data(nodes)
        .enter().append("text")
            .text(node => {
                const name = node.name.split(" ");
                return name.length > 1 ? `${name[0]} ${name[1][0]}` : name[0];
            })
            .attr("dx", (node) => -((node.name.split(" ")[0]).length + 2) * 3.5)
            .attr("dy", 5)
            .on("click", handleClick)
            .attr("class", "name")
}

export function zoomToNode(id: string, zoomAmount: number) {
    const selectedNode = d3.select(`[id="${id}"]`)
    d3.select(`#${GRAPH_ID}`)
        .call(d3.zoom().translateTo, parseInt(selectedNode.attr("cx"), 10), parseInt(selectedNode.attr("cy"), 10))
        .call(d3.zoom().scaleTo, zoomAmount)
        .dispatch(ZOOM_TO_PERSON, {
            detail: {
                transform: d3.zoomTransform(d3.select(`#${GRAPH_ID}`).node() as any)
            }
        } as any);
}

export function zoomByScale(zoomPercentage: number) {
    d3.select(`#${GRAPH_ID}`)
        .call(d3.zoom().scaleBy, zoomPercentage)
        .dispatch(ZOOM_TO_PERSON, {
            detail: {
                transform: d3.zoomTransform(d3.select(`#${GRAPH_ID}`).node() as any)
            }
        } as any);
}
