import * as React from "react";

import { Icon } from "@blueprintjs/core";

import { IScore } from "../../../Types/Graph";
import { IUser } from "../../../Types/Users";
import { calculateScore } from "../../../Utils/GraphHelpers";
import { ScoreDisplay } from "./ScoreDisplay";

import "./GlobalInfoGraphicHelpers.css";

export interface IPersonInformationProps {
    mainPerson: IUser;
    person: IUser | undefined;
    openPopover: boolean;
    closePopoverHover(): void;
    openInformationDialog(): void;
    openPopoverHover(): void;
}

export class InfoPerson extends React.Component<
    IPersonInformationProps
> {
    public render() {
        const { person } = this.props;
        if (person === undefined) {
            return this.renderNoPerson();
        }
        return (
            <div key={person.id} className="info-person pt-dark show-change">
                <div className="flexbox-row" style={{ alignItems: "center" }}>
                    <div className="info-person-name">{person.name}</div>
                </div>
                {this.renderScore(person)}
            </div>
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
            (this.props.mainPerson && (user.id !== this.props.mainPerson.id)) &&
                calculateScore(user, this.props.mainPerson)
        ) || null;
        return <ScoreDisplay score={score} />;
    }
}
