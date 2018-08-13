import * as React from "react";
import { connect } from "react-redux";
import Responsive from "react-responsive";
import { bindActionCreators, Dispatch } from "redux";

import { Toaster } from "@blueprintjs/core";

import { GoogleDispatcher } from "../Dispatchers/GoogleDispatcher";
import { setToast } from "../Helpers/Toaster";
import User from "../Helpers/User";
import IStoreState, { IUserMap } from "../State/IStoreState";
import { SetMainPerson } from "../State/WebsiteActions";
import { DisplayGraph } from "./DisplayGraph";
import { InfoGraphic } from "./InfoGraphic";
import { MobileView } from "./MobileView";
import { AtlaspNavbar } from "./Navbar";

import "./Main.css";

interface IMainProps {
  currentUser: any;
  fetching: boolean;
  isAdmin?: boolean;
  mainPerson?: User;
  userData: IUserMap | undefined;
}

interface IMainState {
  mainPersonDialogOpen: boolean;
}

export interface IMainDispatchProps {
  fetchGoogleSheetData(): void;
  setMainPerson(user: User): void;
}

const Default = (props: any) => <Responsive {...props} minWidth={768} />;
const Mobile = (props: any) => <Responsive {...props} maxWidth={767} />;

class PureMain extends React.Component<IMainProps & IMainDispatchProps, IMainState> {
  private refHandler = {
      toaster: setToast,
  };

  public render() {
    return (
      <div className="fade-in" style={{ display: "flex", flexDirection: "column" }}>
        {this.renderMobile()}
        {this.renderDesktop()}
        <Toaster ref={this.refHandler.toaster} />
      </div>
    );
  }

  private renderMobile() {
    return (
      <Mobile>
        <AtlaspNavbar mobile={true} />
        <MobileView />
      </Mobile>
    )
  }

  private renderDesktop() {
    return (
      <Default>
        <AtlaspNavbar />
        {this.renderGraphAndInfo()}
      </Default>
    )
  }

  private renderGraphAndInfo = () => {
    return(
      <div className="graph-container flexbox-row">
        <div style={{ display: "flex", flexBasis: "85%" }}>
          {this.maybeRenderGraph()}
        </div>
        <div style={{ display: "flex", flexBasis: "15%" }}>
          <InfoGraphic />
        </div>
      </div>
    );
  }

  private maybeRenderGraph() {
    if (this.props.mainPerson === undefined && this.props.isAdmin) {
      return <div className="centered"> Click the “Change User” above to get started! </div>;
    } else if (this.props.mainPerson === undefined) {
      return this.maybeSetMainPerson();
    }
    return <DisplayGraph />;
  }

  private maybeSetMainPerson() {
    const { currentUser, userData } = this.props;
    if (currentUser === undefined || userData === undefined) {
      this.props.fetchGoogleSheetData();
      return <div className="centered">Hang tight, refreshing the data.</div>
    }

    const person = Object.values(userData).find((user) => user.fullName.toLowerCase() === currentUser.ig.toLowerCase());
    if (person === undefined) {
      return <div>Hum, something went wrong. We can't seem to find you. Contact an administrator.</div>
    }

    this.props.setMainPerson(person);
    return;
  }
}

function mapStateToProps(state: IStoreState) {
  return {
    currentUser: state.GoogleReducer.currentUser,
    fetching: state.GoogleReducer.isFetching,
    isAdmin: state.GoogleReducer.isAdmin,
    mainPerson: state.WebsiteReducer.mainPerson,
    userData: state.GoogleReducer.userData,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const googleDispatcher = new GoogleDispatcher(dispatch);
  return {
    fetchGoogleSheetData: googleDispatcher.fetchGoogleSheetData,
    ...bindActionCreators({
      setMainPerson: SetMainPerson.create,
    }, dispatch),
  };
}

export const Main = connect(mapStateToProps, mapDispatchToProps)(PureMain);
