import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import Event from "../Helpers/Event";
import User from "../Helpers/User";
import IStoreState from "../State/IStoreState";
import { ChangeParty, SetInfoPerson, SetMainPerson } from "../State/WebsiteActions";
import { InfoPerson } from "./InfoGraphicHelpers/InfoPerson";
import { SinglePersonDataDialog } from "./InfoGraphicHelpers/SinglePersonDataDialog";

import "./InfoGraphic.css";

interface IInfoGraphicProps {
    infoPerson: User;
    mainPerson: User;
    party: string[];
    userData: { id: User };
    eventData: { id: Event };
}

interface IStateProps {
    openDialog: boolean;
    openInformationPopover: boolean;
    openPopover: boolean;
}

export interface IInfoGraphDispatchProps {
    setParty(party: string[]): void;
    setInfoPerson(user: User): void;
    setMainPerson(user: User): void;
}

class PureInfoGraphic extends React.Component<IInfoGraphicProps & IInfoGraphDispatchProps, IStateProps> {
    public state = {
        openDialog: false,
        openInformationPopover: false,
        openPopover: false,
    };

    public render() {
        return(
            <div className="flexbox">
                <InfoPerson
                    mainPerson={this.props.mainPerson}
                    openPopover={this.state.openPopover}
                    person={this.props.infoPerson}
                    closePopoverHover={this.closePopoverHover}
                    openInformationDialog={this.openInformationDialog}
                    openPopoverHover={this.openPopoverHover}
                />
                {this.maybeRenderSinglePersonDataDialog()}
            </div>
        );
    }

    private maybeRenderSinglePersonDataDialog() {
        if (this.props.infoPerson === undefined
                || this.props.mainPerson === undefined
                || this.props.mainPerson.id === this.props.infoPerson.id) {
            return null;
        }
        return (
            <SinglePersonDataDialog
                events={this.props.infoPerson.connections[this.props.mainPerson.id]}
                isOpen={this.state.openDialog}
                onClose={this.closeInformationDialog}
                person={this.props.infoPerson}
            />
        );
    }

    private openPopoverHover = () => this.setState({ openPopover: true });
    private closePopoverHover = () => this.setState({ openPopover: false });

    private openInformationDialog = () => this.setState({ openDialog: true });
    private closeInformationDialog = () => this.setState({ openDialog: false });
}

function mapStateToProps(state: IStoreState) {
  return {
    eventData: state.GoogleReducer.eventData,
    infoPerson: state.WebsiteReducer.infoPerson,
    mainPerson: state.WebsiteReducer.mainPerson,
    party: state.WebsiteReducer.party,
    userData: state.GoogleReducer.userData,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators({
        setInfoPerson: SetInfoPerson.create,
        setMainPerson: SetMainPerson.create,
        setParty: ChangeParty.create,
    }, dispatch);
}

export const InfoGraphic = connect(mapStateToProps, mapDispatchToProps)(PureInfoGraphic);
