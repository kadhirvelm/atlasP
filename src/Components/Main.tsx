import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Toaster } from "@blueprintjs/core";

import { setToast } from "../Helpers/Toaster";
import User from "../Helpers/User";
import IStoreState, { IUserMap } from "../State/IStoreState";
import { SetMainPerson } from "../State/WebsiteActions";
import { DisplayGraph } from "./DisplayGraph";
import { InfoGraphic } from "./InfoGraphic";
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
  setMainPerson(user: User): void;
}

class PureMain extends React.Component<IMainProps & IMainDispatchProps, IMainState> {
  private refHandler = {
      toaster: setToast,
  };

  public render() {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <AtlaspNavbar />
        {this.renderGraphAndInfo()}
        <Toaster ref={this.refHandler.toaster} />
      </div>
    );
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
      return <div className="centered">Hum, something went wrong. Try refreshing the data.</div>
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
  return {
    ...bindActionCreators({
      setMainPerson: SetMainPerson.create,
    }, dispatch),
  };
}

export const Main = connect(mapStateToProps, mapDispatchToProps)(PureMain);
