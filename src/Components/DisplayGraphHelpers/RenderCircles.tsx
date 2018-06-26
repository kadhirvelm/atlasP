import * as React from "react";

import { IStrokeSettings } from './RenderLine';
import { ISingleLine, ISingleLocation } from '../../Helpers/Selectors';

export interface IRenderCirclesProps {
    key: string;
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
    public render() {
        const fromHostLocation = { x: {from: this.props.origin.x, to: this.props.location.x }, y: { from: this.props.origin.y, to: this.props.location.y } }
        const toHostLocation = { x: {from: this.props.location.x, to: this.props.origin.x }, y: { from: this.props.location.y, to: this.props.origin.y } }
        return (
            <svg>
                {this.props.lineSettings.fromHost && this.renderCircleSet(this.props.key + '_fromHost_', fromHostLocation)}
                {this.props.lineSettings.toHost && this.renderCircleSet(this.props.key + '_toHost_', toHostLocation)}
            </svg>
        )
    }

    private renderCircleSet(key: string, locations: IMappedStartAndFinish) {
        return (
            <svg>
                {this.renderSingleCircle(key + "#1", locations, '0s')}
                {this.renderSingleCircle(key + "#2", locations, '2.5s')}
            </svg>
        )
    }

    private renderSingleCircle(id: string, locations: IMappedStartAndFinish, delay: string) {
        return (
            <circle id={'circle' + id} r='3' {...this.props.strokeSettings}>
                <animate xlinkHref={'#circle' + id} attributeName='cx' from={locations.x.from} to={locations.x.to} dur='5s' repeatCount='indefinite' begin={delay} />
                <animate xlinkHref={'#circle' + id} attributeName='cy' from={locations.y.from} to={locations.y.to} dur='5s' repeatCount='indefinite' begin={delay} />
            </circle>
        )
    }
}