import * as React from "react";

import { IScore } from "../../../Types/Graph";

import "./GlobalInfoGraphicHelpers.css";

interface IScoreDisplayProps {
    score: IScore | null;
}

export class ScoreDisplay extends React.Component<IScoreDisplayProps> {
    public render() {
        return <h4> Under construction... </h4>;
    }
}
