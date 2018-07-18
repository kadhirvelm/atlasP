import * as React from "react";

import { ISingleLine, ISingleLocation } from "../../Helpers/selectors";
import { RenderCircles } from "./RenderCircles";

export interface IRenderLineProps {
    index: string;
    lineSettings: ISingleLine;
    location: ISingleLocation;
    origin: ISingleLocation;
}

export interface IStrokeSettings {
    stroke: string;
    fill: string;
    strokeWidth: string;
}

export class RenderLine extends React.Component<IRenderLineProps> {
    private RED_LINE = { stroke: "red", fill: "red", strokeWidth: "2" };
    private GREEN_LINE = { stroke: "green", fill: "green", strokeWidth: "2" };

    public render() {
        const strokeSettings = this.props.lineSettings.red ? this.RED_LINE : this.GREEN_LINE;
        const style = {
            opacity: (this.props.lineSettings["fromHost"] && this.props.lineSettings["toHost"]) ? 1 : 0.15,
        };
        const d = `M${this.props.location.x} ${this.props.location.y} L${this.props.origin.x} ${this.props.origin.y}`;
        return (
            <svg>
                <path
                    d={d}
                    {...style}
                    {...strokeSettings}
                />
                {this.renderCircles(strokeSettings)}
            </svg>
        );
    }

    private renderCircles(strokeSettings: IStrokeSettings) {
        return (
            <RenderCircles
                index={this.props.index}
                strokeSettings={strokeSettings}
                lineSettings={this.props.lineSettings}
                location={this.props.location}
                origin={this.props.origin}
            />
        );
    }
}
