import * as React from "react";

import { Icon, Popover } from "@blueprintjs/core";

import { IScore } from "../../../Types/Graph";
import { IUser } from "../../../Types/Users";
import { calculateScore } from "../../../Utils/GraphHelpers";
import { ScoreDisplay } from "./ScoreDisplay";

import "./GlobalInfoGraphicHelpers.css";

export interface IPersonInformationProps {
    currentUser: IUser;
    person: IUser | undefined;
    openPopover: boolean;
    closePopoverHover(): void;
    openInformationDialog(): void;
    openPopoverHover(): void;
}

export class InfoPerson extends React.Component<IPersonInformationProps> {
    public render() {
        if (this.props.person === undefined) {
            return this.renderNoPerson();
        }
        return (
            <div key={this.props.person.id} className="info-person pt-dark show-change">
                <div className="flexbox-row" style={{ alignItems: "center" }}>
                    <div className="info-person-name">{this.props.person.name}</div>
                    <div className="justify-end"> {this.renderPopover(this.props.person)} </div>
                </div>
                {this.renderScore(this.props.person)}
            </div>
        );
    }

    private renderPopover(person: IUser) {
        return (
            <Popover isOpen={this.props.openPopover} className="change-to-pointer">
                <div>
                    <Icon
                        onMouseEnter={this.props.openPopoverHover}
                        onMouseLeave={this.props.closePopoverHover}
                        onClick={this.props.openInformationDialog}
                        icon="help"
                    />
                </div>
                <div
                    style={{ padding: "15px", textAlign: "center" }}
                    className={person.gender === "M" ? "blue-box" : "red-box"}
                >
                    <div className="padding-box">
                        {person.name} ({person.id})
                    </div>
                    <div className="padding-box"> {person.contact} </div>
                    <div className="padding-box">
                        {person.age}, {person.location}
                    </div>
                </div>
            </Popover>
        );
    }

    private renderNoPerson() {
        return (
            <div key="No Person" className="flexbox-column dark-background pt-dark info-person no-person">
                <Icon icon="person" />
            </div>
        );
    }

    private renderScore(user: IUser) {
        const score: IScore | null = (
            (this.props.currentUser && (user.id !== this.props.currentUser.id)) &&
                calculateScore(user, this.props.currentUser)
        ) || null;
        return <ScoreDisplay score={score} />;
    }
}
