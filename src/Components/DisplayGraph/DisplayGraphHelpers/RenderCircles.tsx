import * as React from "react";

import { ISingleLine, ISingleLocation } from "../../../Utils/selectors";
import { IStrokeSettings } from "./RenderLine";

export interface IRenderCirclesProps {
    index: string;
    strokeSettings: IStrokeSettings;
    lineSettings: ISingleLine;
    location: ISingleLocation;
    origin: ISingleLocation;
}

export interface IStartAndFinish {
    from: number;
    to: number;
}

export interface IMappedStartAndFinish {
    x: IStartAndFinish;
    y: IStartAndFinish;
}

export class RenderCircles extends React.Component<IRenderCirclesProps> {
    private FROM_HOST_LOCATION = {
        x: { from: this.props.origin.x, to: this.props.location.x },
        y: { from: this.props.origin.y, to: this.props.location.y },
    };
    private TO_HOST_LOCATION = {
        x: { from: this.props.location.x, to: this.props.origin.x },
        y: { from: this.props.location.y, to: this.props.origin.y },
    };

    public render() {
        return (
            <svg>
                {this.maybeRenderHost(this.props.lineSettings.fromHost, "_fromHost_", this.FROM_HOST_LOCATION)}
                {this.maybeRenderHost(this.props.lineSettings.toHost, "_toHost_", this.TO_HOST_LOCATION)}
            </svg>
        );
    }

    private maybeRenderHost(shouldRender: boolean | undefined, key: string, location: IMappedStartAndFinish) {
        if (!shouldRender) {
            return null;
        }
        return this.renderCircleSet(this.props.index + key, location);
    }

    private renderCircleSet(key: string, locations: IMappedStartAndFinish) {
        return (
            <svg>
                {this.renderSingleCircle(key + "#1", locations, "0s")}
                {this.renderSingleCircle(key + "#2", locations, "2.5s")}
            </svg>
        );
    }

    private renderSingleCircle(id: string, locations: IMappedStartAndFinish, delay: string) {
        return (
            <circle id={"circle" + id} r="3" {...this.props.strokeSettings}>
                <animate
                    xlinkHref={"#circle" + id}
                    attributeName="cx"
                    from={locations.x.from}
                    to={locations.x.to}
                    dur="5s"
                    repeatCount="indefinite"
                    begin={delay}
                />
                <animate
                    xlinkHref={"#circle" + id}
                    attributeName="cy"
                    from={locations.y.from}
                    to={locations.y.to}
                    dur="5s"
                    repeatCount="indefinite"
                    begin={delay}
                />
            </circle>
        );
    }
}
