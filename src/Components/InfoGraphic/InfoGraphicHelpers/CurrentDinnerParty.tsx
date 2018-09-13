import * as _ from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Button } from "@blueprintjs/core";

import IStoreState from "../../../State/IStoreState";
import { ChangeParty, SetInfoPerson } from "../../../State/WebsiteActions";
import { IUser, IUserMap } from "../../../Types/Users";

import "./GlobalInfoGraphicHelpers.css";

export interface ICurrentDinnerPartyStoreProps {
    party?: string[];
    userData?: IUserMap;
}

export interface ICurrentDinnerPartyDispatchProps {
    setParty(party: string[]): void;
    setInfoPerson(user: IUser): void;
}

export class PureCurrentDinnerParty extends React.Component<
    ICurrentDinnerPartyStoreProps & ICurrentDinnerPartyDispatchProps
    > {
    public componentWillMount() {
        this.renderSingleIndividual = this.renderSingleIndividual.bind(this);
    }

    public render() {
        return (
            <div
                className="flexbox-column dark-background pt-dark current-dinner-party"
                onDrop={this.receiveNewPerson}
                onDragOver={this.preventDefault}
            >
                <h4> Current Party </h4>
                <div className="party-holder">
                    {this.props.party ? this.props.party.map(this.renderSingleIndividual) : <div />}
                </div>
            </div>
        );
    }

    private receiveNewPerson = (event: any) => {
        event.preventDefault();
        this.props.setParty(_.uniq((this.props.party || []).concat(event.dataTransfer.getData("text").split("_")[1])));
    }

    private preventDefault(event: any) {
        event.preventDefault();
    }

    private renderSingleIndividual(id: string) {
        const user = this.props.userData && this.props.userData[id];

        if (user == null) {
            return null;
        }

        return(
          <div key={id} style={{ position: "relative", fontSize: "1vw" }} className="user-display">
              <div className="user-div" onClick={this.makeInfoPerson(user)}>
                  <div> {user.name} </div>
              </div>
              <Button className="removal-button" icon="cross" onClick={this.removePerson(user)} />
          </div>
        );
    }

    private makeInfoPerson(user: IUser) {
        return () => this.props.setInfoPerson(user);
    }

    private removePerson(user: IUser) {
        return () => this.props.setParty(_.filter(this.props.party, (id) => id !== user.id));
    }
}

function mapStateToProps(state: IStoreState): ICurrentDinnerPartyStoreProps {
    return {
        party: state.WebsiteReducer.party,
        userData: state.DatabaseReducer.userData,
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators({
        setInfoPerson: SetInfoPerson.create,
        setParty: ChangeParty.create,
    }, dispatch);
}

export const CurrentDinnerParty = connect(mapStateToProps, mapDispatchToProps)(PureCurrentDinnerParty);
