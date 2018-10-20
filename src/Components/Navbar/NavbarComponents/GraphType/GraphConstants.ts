import { IGraphType } from "../../../../Types/Graph";
import { IConnectionEvents } from "../../../../Utils/selectors";
import { getDifferenceBetweenDates } from "../../../../Utils/Util";

const DISTANCE_MULTIPLIER = 100;

export const ONE_ON_ONE_GRAPH: IGraphType = {
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
            distance: (maximum + 1 - userAndEvents.distance) * DISTANCE_MULTIPLIER,
            strength: 0.5,
        }));
    },
    id: "1-on-1",
}

export const DRIFT_GRAPH: IGraphType = {
    generateLinks: (source: string, connections: IConnectionEvents) => {
        const links = Object.entries(connections).map(userAndEvents => {
            const lastEventDate = userAndEvents[1].sort((a, b) => getDifferenceBetweenDates(a.date, b.date)).slice(-1)[0];
            return {
                distance: Math.max(Math.round(getDifferenceBetweenDates(new Date(), lastEventDate.date)), 1) * DISTANCE_MULTIPLIER,
                source,
                strength: 0.5,
                target: userAndEvents[0]
            };
        });
        return links;
    },
    id: "drift",
}
