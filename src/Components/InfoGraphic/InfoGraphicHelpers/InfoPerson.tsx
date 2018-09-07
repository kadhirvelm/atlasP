import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Button, Icon, Intent, Popover } from "@blueprintjs/core";

import IStoreState from "../../../State/IStoreState";
import { SetMainPerson } from "../../../State/WebsiteActions";
import { calculateScore, IScore } from "../../../Utils/GraphHelpers";
import User from "../../../Utils/User";
import { ScoreDisplay } from "./ScoreDisplay";

import "./GlobalInfoGraphicHelpers.css";

export interface IPersonInformationProps {
    mainPerson: User;
    person: User | undefined;
    openPopover: boolean;
    closePopoverHover(): void;
    openInformationDialog(): void;
    openPopoverHover(): void;
}

export interface IPersonInformationStoreProps {
    isAdmin: boolean | undefined;
}

export interface IPersonInformationDispatchProps {
    setMainPerson(user: User): void;
}

export class PurePersonInformation extends React.Component<
    IPersonInformationProps & IPersonInformationDispatchProps & IPersonInformationStoreProps
> {
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
                {this.maybeRenderChangeButton()}
            </div>
        );
    }

    private maybeRenderChangeButton() {
        if (!this.props.isAdmin) {
            return null;
        }
        return (
            <div style={{ position: "absolute", left: "50%", bottom: "1%", transform: "translate(-50%, -1%)" }}>
                <Button
                    icon="exchange"
                    text="Change"
                    onClick={this.setMainPerson}
                    intent={Intent.WARNING}
                    className="grow"
                />
            </div>
        )
    }

    private renderPopover(person: User) {
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
                        {person.fullName} ({person.id})
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

    private renderScore(user: User) {
        const score: IScore | null = (
            (this.props.mainPerson && (user.id !== this.props.mainPerson.id)) &&
                calculateScore(user, this.props.mainPerson)
        ) || null;
        return <ScoreDisplay score={score} />;
    }

    private setMainPerson = () => {
        if (this.props.person && this.props.setMainPerson) {
            this.props.setMainPerson(this.props.person);
        }
    }
}

function mapStoreToProps(state: IStoreState): IPersonInformationStoreProps {
    return {
        isAdmin: state.GoogleReducer.isAdmin,
    }
}

function mapDispatchToProps(dispatch: Dispatch): IPersonInformationDispatchProps {
    return bindActionCreators({
        setMainPerson: SetMainPerson.create,
    }, dispatch);
}

export const InfoPerson = connect(mapStoreToProps, mapDispatchToProps)(PurePersonInformation);
