import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import IStoreState from "../../State/IStoreState";
import { ChangeParty, SetInfoPerson } from "../../State/WebsiteActions";
import { IEventMap } from "../../Types/Events";
import { IUser, IUserMap } from "../../Types/Users";
import User from "../../Utils/User";
import { CurrentEvents } from "./InfoGraphicHelpers/CurrentEvents";
import { InfoPerson } from "./InfoGraphicHelpers/InfoPerson";
import { SinglePersonDataDialog } from "./InfoGraphicHelpers/SinglePersonDataDialog";

import "./InfoGraphic.css";

interface IInfoGraphicProps {
    infoPerson: IUser | undefined;
    mainPerson: IUser | undefined;
    party: string[] | undefined;
    userData: IUserMap | undefined;
    eventData: IEventMap | undefined;
}

export interface IInfoGraphDispatchProps {
    setParty(party: string[]): void;
    setInfoPerson(user: User): void;
}

interface IStateProps {
    openDialog: boolean;
    openInformationPopover: boolean;
    openPopover: boolean;
}

class PureInfoGraphic extends React.Component<IInfoGraphicProps & IInfoGraphDispatchProps, IStateProps> {
    public state = {
        openDialog: false,
        openInformationPopover: false,
        openPopover: false,
    };

    public render() {
        const { mainPerson } = this.props;
        if (mainPerson === undefined) {
            return null;
        }
        return(
            <div className="flexbox">
                <InfoPerson
                    mainPerson={mainPerson}
                    openPopover={this.state.openPopover}
                    person={this.props.infoPerson}
                    closePopoverHover={this.closePopoverHover}
                    openInformationDialog={this.openInformationDialog}
                    openPopoverHover={this.openPopoverHover}
                />
                <CurrentEvents />
                {this.maybeRenderSinglePersonDataDialog()}
            </div>
        );
    }

    private maybeRenderSinglePersonDataDialog() {
        if (this.props.infoPerson === undefined
                || this.props.mainPerson === undefined
                || this.props.mainPerson.id === this.props.infoPerson.id
                || this.props.infoPerson.connections === undefined) {
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

function mapStateToProps(state: IStoreState): IInfoGraphicProps {
  return {
    eventData: state.DatabaseReducer.eventData,
    infoPerson: state.WebsiteReducer.infoPerson,
    mainPerson: state.DatabaseReducer.currentUser,
    party: state.WebsiteReducer.party,
    userData: state.DatabaseReducer.userData,
  };
}

function mapDispatchToProps(dispatch: Dispatch): IInfoGraphDispatchProps {
    return bindActionCreators({
        setInfoPerson: SetInfoPerson.create,
        setParty: ChangeParty.create,
    }, dispatch);
}

export const InfoGraphic = connect(mapStateToProps, mapDispatchToProps)(PureInfoGraphic);
