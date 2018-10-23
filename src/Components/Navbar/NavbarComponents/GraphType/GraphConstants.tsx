import * as React from "react";

import { DriftGraphIcon } from "../../../../icons/driftGraphIcon";
import { GroupsGraphIcon } from "../../../../icons/groupsGraphIcon";
import { RelativeGraphIcon } from "../../../../icons/relativeGraphIcon";
import { IGraphType } from "../../../../Types/Graph";
import { IConnectionEvents } from "../../../../Utils/selectors";
import { getDifferenceBetweenDates, getLatestEventDate } from "../../../../Utils/Util";

const ICON_ATTRIBUTES = {
    height: 55,
    style: { cursor: "pointer", fill: "white", minHeight: 55, minWidth: 100, stroke: "white", },
    width: 125,
};

/**
 * Drift - people drift away from you the longer it's been since you've seen them.
 */

const DISTANCE_MULTIPLIER_DRIFT = 100;
const LOG_MULTIPLIER_DRIFT = 3;

const DRIFT_NORMALIZER = (totalDaysSinceEvent: number) => (Math.log(totalDaysSinceEvent) * LOG_MULTIPLIER_DRIFT + 1) * DISTANCE_MULTIPLIER_DRIFT;
export const DRIFT_GRAPH: IGraphType = {
    generateLinks: (source: string, connections: IConnectionEvents) => {
        const links = Object.entries(connections).map(userAndEvents => {
            const lastEvent = getLatestEventDate(userAndEvents[1]);
            const totalDaysSinceEvent = lastEvent === undefined ? 80 : Math.max(Math.round(getDifferenceBetweenDates(new Date(), lastEvent.date)), 1);
            return {
                distance: DRIFT_NORMALIZER(totalDaysSinceEvent),
                source,
                strength: 0.5,
                target: userAndEvents[0]
            };
        });
        return links;
    },
    icon: <DriftGraphIcon attributes={ICON_ATTRIBUTES} />,
    id: "drift",
    tooltip: (
        <div className="graph-helper-tooltip">
            <div className="graph-helper-title">Drift</div>
            The longer it's been since you've seen a friend, the farther they will drift away from you.
            <div className="graph-helper-math-box">
                Distance = Math.log(# days since last event)
            </div>
        </div>
    ),
}

/**
 * Relative - the more events you go to with someone, the closer they become to you.
 */

const DISTANCE_MULTIPLIER_RELATIVE_GRAPH = 100;

export const RELATIVE_GRAPH: IGraphType = {
    generateLinks: (source: string, connections: IConnectionEvents) => {
        let maximum = 0;
        const links = Object.entries(connections).map(userAndEvents => {
            maximum = Math.max(maximum, userAndEvents[1].length);
            return {
                distance: userAndEvents[1].length,
                source,
                strength: userAndEvents[1].length,
                target: userAndEvents[0]
            };
        });
        return links.map(userAndEvents => ({
            ...userAndEvents,
            distance: (maximum + 1 - userAndEvents.distance) * DISTANCE_MULTIPLIER_RELATIVE_GRAPH,
            strength: 0.5,
        }));
    },
    icon: <RelativeGraphIcon attributes={ICON_ATTRIBUTES} />,
    id: "Relative",
    tooltip: (
        <div className="graph-helper-tooltip">
            <div className="graph-helper-title">Relative</div>
            The more events you go to with a friend, the closer they will be to you.
            <div className="graph-helper-math-box">
                Distance = (Maximum # events) - #(selected user events)
            </div>
        </div>
    ),
}

/**
 * Groups - clumps your friend groups together.
 */

const generateUniqueKey = (idA: string, idB: string) => idA.localeCompare(idB) === 1 ? `${idB}_${idA}` : `${idA}_${idB}`;

export const GROUPS_GRAPH: IGraphType = {
    generateLinks: (_: string, connections: IConnectionEvents) => {
        const personToPersonMapping = {};
        let maximumNormalization = 0;
        Object.entries(connections).forEach(userAndEvents => {
            userAndEvents[1].forEach((event) => {
                event.attendees.forEach((user) => {
                    if (user.id === userAndEvents[0] || connections[user.id] === undefined) {
                        return;
                    }
                    const id = generateUniqueKey(user.id.toString(), userAndEvents[0].toString());
                    personToPersonMapping[id] = (personToPersonMapping[id] || 0) + 1;
                    maximumNormalization = Math.max(personToPersonMapping[id], maximumNormalization);
                });
            });
        });
        return Object.entries(personToPersonMapping).map((usersAndEvents) => {
            const users = usersAndEvents[0].split("_");
            return {
                distance: 200,
                source: users[0],
                strength: (usersAndEvents[1] as number) / maximumNormalization,
                target: users[1],
            }
        });
    },
    icon: <GroupsGraphIcon attributes={ICON_ATTRIBUTES} />,
    id: "Groups",
    tooltip: (
        <div className="graph-helper-tooltip">
            <div className="graph-helper-title">Groups</div>
            Whenever one person sees another, the graph will bring them closer together.
            <div className="graph-helper-math-box">
                Strength = #(selected user events) / (Maximum # events)
            </div>
        </div>
    ),
}

/**
 * Order to render the graph types.
 */

export const GRAPHS = [ DRIFT_GRAPH, RELATIVE_GRAPH, GROUPS_GRAPH ];
