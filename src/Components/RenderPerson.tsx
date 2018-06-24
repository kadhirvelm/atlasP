import * as React from "react"

import User from "../Helpers/User";

import "./DisplayGraph.css";
import { IScore, IScoreMainPerson } from "../Helpers/GraphHelpers";

export interface IRenderPersonProps {
    dimension: number;
    lastEventDate: string;
    location: { x: number, y: number };
    scoreTally: IScore | IScoreMainPerson;
    user: User;
    changeInfoPerson(user: User): () => void;
    changeMainPerson(user: User): () => void;
}

export class RenderPerson extends React.Component<IRenderPersonProps> {
    private MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
    private GREEN_DAYS = 14;
    private YELLOW_DAYS = 28;

    public render() {
        return (
            <div key={this.props.user.id} style={{ position: "absolute", left: this.props.location.x + "%", top: this.props.location.y + "%", transform: "translate(-50%, -50%)" }}>
                <div className={"user-node time-difference " + this.calcuateTimeDifferenceInDays()} style={{ width: this.props.dimension + 1 + "vmin", height: this.props.dimension + 1 + "vmin" }} />
                <div
                    id={this.props.user.gender + "_" + this.props.user.id}
                    className={"user-node" + " " + this.props.user.gender}
                    draggable={true}
                    onDragStart={this.handleDragStart}
                    onDoubleClick={this.props.changeMainPerson(this.props.user)}
                    onClick={this.props.changeInfoPerson(this.props.user)}
                    style={{ width: this.props.dimension + "vmin", height: this.props.dimension + "vmin" }}
                >
                    <div className="centered flexbox-column-centered" style={{ color: "white" }}>
                        <div> {this.props.user.name} </div>
                        <div> {this.scoreTypeIsMainPerson(this.props.scoreTally) ? this.props.scoreTally.finalScore : "Main"} </div>
                    </div>
                </div>
            </div>
        )
    }

    private scoreTypeIsMainPerson(scoreTally: IScore | IScoreMainPerson): scoreTally is IScore {
        return !scoreTally.isMain
    }

    private handleDragStart(event: any) {
        event.dataTransfer.setData("text", event.currentTarget.id)
        const img = document.createElement("img")
        img.src = "https://d30y9cdsu7xlg0.cloudfront.net/png/5024-200.png"
        event.dataTransfer.setDragImage(img, 50, 150)
    }

    private calcuateTimeDifferenceInDays() {
        const timeDiff = (new Date().getTime() - new Date(this.props.lastEventDate).getTime()) / (this.MILLISECONDS_IN_DAY)
        if(timeDiff < this.GREEN_DAYS){
            return "G"
        } else if (timeDiff < this.YELLOW_DAYS){
            return "Y"
        }
        return "R"
    }
}
