import * as React from "react";

import { IScore, IScoreMainPerson } from "../../../Types/Graph";
import { IUser } from "../../../Types/Users";
import { ISingleLocation } from "../../../Utils/selectors";

import "./RenderPerson.css";

export interface IRenderPersonProps {
    dimension: number;
    lastEventDate?: string;
    location: ISingleLocation;
    scoreTally: IScore | IScoreMainPerson;
    user: IUser;
    changeInfoPerson(user: IUser): () => void;
}

export class RenderPerson extends React.Component<IRenderPersonProps> {
    private MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
    private GREEN_DAYS = 30;
    private YELLOW_DAYS = 90;

    public render() {
        return (
            <div
                className="person"
                key={this.props.user.id}
                style={{ left: this.props.location.x + "%", top: this.props.location.y + "%" }}
            >
                <div
                    className={"user-node time-difference " + this.calcuateTimeDifferenceInDays()}
                    style={{ width: this.props.dimension + 1 + "vmin", height: this.props.dimension + 1 + "vmin" }}
                />
                <div
                    id={this.props.user.gender + "_" + this.props.user.id}
                    className={"user-node" + " " + this.props.user.gender}
                    draggable={true}
                    onDragStart={this.handleDragStart}
                    onClick={this.props.changeInfoPerson(this.props.user)}
                    style={{ width: this.props.dimension + "vmin", height: this.props.dimension + "vmin" }}
                >
                    <div className="centered flexbox-column-centered" style={{ color: this.props.dimension > 0 ? "white" : "#2C3E50" }}>
                        <div> {this.props.user.name} </div>
                        <div> {this.maybeRenderScore(this.props.scoreTally)} </div>
                    </div>
                </div>
            </div>
        );
    }

    private maybeRenderScore(scoreTally: IScore | IScoreMainPerson) {
        if (this.props.dimension <= 0) {
            return null;
        } else if (this.scoreTypeIsMainPerson(scoreTally)) {
            return scoreTally.finalScore;
        }
        return "Main";
    }

    private scoreTypeIsMainPerson(scoreTally: IScore | IScoreMainPerson): scoreTally is IScore {
        return !scoreTally.isMain;
    }

    private handleDragStart(event: any) {
        event.dataTransfer.setData("text", event.currentTarget.id);
        const img = document.createElement("img");
        img.src = "https://d30y9cdsu7xlg0.cloudfront.net/png/5024-200.png";
        event.dataTransfer.setDragImage(img, 50, 150);
    }

    private calcuateTimeDifferenceInDays() {
        const { lastEventDate } = this.props;
        if (lastEventDate === undefined) {
            return "";
        }

        const currentTime = (new Date().getTime() - new Date(lastEventDate).getTime());
        const daysDifference = currentTime / (this.MILLISECONDS_IN_DAY);
        if (daysDifference < this.GREEN_DAYS) {
            return "G";
        } else if (daysDifference < this.YELLOW_DAYS) {
            return "Y";
        }
        return "R";
    }
}
