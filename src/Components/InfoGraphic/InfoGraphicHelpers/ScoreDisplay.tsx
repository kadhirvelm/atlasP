import * as React from "react";

import { IScore } from "../../../Types/Graph";

import "./GlobalInfoGraphicHelpers.css";

interface IScoreDisplayProps {
    score: IScore | null;
}

export class ScoreDisplay extends React.Component<IScoreDisplayProps> {
    public render() {
        if (this.props.score === null) {
            return null;
        }
        return(
            <div>
                <div className="flexbox-column" style={{ flexGrow: 1 }}>
                    <div className="single-row">
                        <div className="single-column label">
                            Connections
                        </div>
                        <div className="single-column value">
                            {this.props.score.eventScore}
                        </div>
                    </div>
                    <div className="single-row">
                        <div className="single-column label">
                            Gender
                        </div>
                        <div className="single-column value">
                            {this.props.score.genderScore > 0 ? this.props.score.genderScore : "--"}
                        </div>
                    </div>
                    <div className="single-row">
                        <div className="single-column label">
                            Age
                        </div>
                        <div className="single-column value">
                            {this.props.score.ageScore !== 0 ? this.props.score.ageScore : "--"}
                        </div>
                    </div>
                    <div className="single-row">
                        <div className="single-column label">
                            Like
                        </div>
                        <div className="single-column value">
                            {this.props.score.likeScore > 1 ? this.props.score.likeScore : "--"}
                        </div>
                    </div>
                    <div className="single-row" style={{ borderBottom: "dashed 0px black" }}>
                        <div className="single-column label">
                            Dislike
                        </div>
                        <div className="single-column value">
                            {this.props.score.dislikeScore < 1 ? this.props.score.dislikeScore : "--"}
                        </div>
                    </div>
                    <div
                        className="single-row"
                        style={{ paddingTop: "15px", borderTop: "solid 2.5px white", borderBottom: "dashed 0px black" }}
                    >
                        <div className="single-column label">
                            Final Score
                        </div>
                        <div className="single-column value">
                            {this.props.score.finalScore}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
