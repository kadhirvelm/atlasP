import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import IStoreState from "../../State/IStoreState";
import { SetInfoPerson } from "../../State/WebsiteActions";
import { IEvent } from "../../Types/Events";
import { IUser, IUserMap } from "../../Types/Users";
import { selectSortedEvents } from "../../Utils/Selectors";
import User from "../../Utils/User";
import { SinglePersonDataDialog } from "./InfoGraphicHelpers/SinglePersonDataDialog";
import { InfoPerson } from "./InfoPerson";

import "./InfoGraphic.css";

interface IInfoGraphicProps {
    currentUser: IUser | undefined;
    events: IEvent[] | undefined;
    infoPerson: IUser | undefined;
    userData: IUserMap | undefined;
}

export interface IInfoGraphDispatchProps {
    setInfoPerson(user: User): void;
}

interface IStateProps {
    openDialog: boolean;
    openInformationPopover: boolean;
}

class PureInfoGraphic extends React.Component<IInfoGraphicProps & IInfoGraphDispatchProps, IStateProps> {
    public state = {
        openDialog: false,
        openInformationPopover: false,
    };

    public render() {
        const { currentUser } = this.props;
        if (currentUser === undefined) {
            return null;
        }
        return(
            <div className="main-info-graphic-container">
                <InfoPerson
                    person={this.props.infoPerson}
                    openInformationDialog={this.openInformationDialog}
                />
                {this.maybeRenderSinglePersonDataDialog()}
            </div>
        );
    }

    private maybeRenderSinglePersonDataDialog() {
        const { infoPerson, currentUser } = this.props;
        if (infoPerson === undefined || currentUser === undefined || currentUser.connections === undefined) {
            return null;
        }
        return (
            <SinglePersonDataDialog
                events={currentUser.connections[infoPerson.id]}
                isOpen={this.state.openDialog}
                onClose={this.closeInformationDialog}
                person={infoPerson}
            />
        );
    }

    private openInformationDialog = () => this.setState({ openDialog: true });
    private closeInformationDialog = () => this.setState({ openDialog: false });
}

function mapStateToProps(state: IStoreState): IInfoGraphicProps {
  return {
    currentUser: state.DatabaseReducer.currentUser,
    events: selectSortedEvents(state),
    infoPerson: state.WebsiteReducer.infoPerson,
    userData: state.DatabaseReducer.userData,
  };
}

function mapDispatchToProps(dispatch: Dispatch): IInfoGraphDispatchProps {
    return bindActionCreators({
        setInfoPerson: SetInfoPerson.create,
    }, dispatch);
}

export const InfoGraphic = connect(mapStateToProps, mapDispatchToProps)(PureInfoGraphic);
