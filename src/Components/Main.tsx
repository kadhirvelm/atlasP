import * as React from "react";
import { connect } from "react-redux";
import Responsive from "react-responsive";
import { Dispatch } from "redux";

import { DatabaseDispatcher } from "../Dispatchers/DatabaseDispatcher";
import IStoreState from "../State/IStoreState";
import { IUser } from "../Types/Users";
import { getAuthenticationToken } from "../Utils/Security";
import { DisplayGraph } from "./DisplayGraph/DisplayGraph";
import { MobileView } from "./Mobile/MobileView";
import { AtlaspNavbar } from "./Navbar/Navbar";

import { InfoPerson } from "./Informational/InfoPerson";
import "./Main.scss";

const Default = (props: any) => <Responsive {...props} minWidth={768} />;
const Mobile = (props: any) => <Responsive {...props} maxWidth={767} />;

export interface IMainStoreProps {
  currentUser: IUser | undefined;
}

export interface IMainDispatchProps {
  getAllRelationships(): void;
  getLatestGraph(user: IUser): void;
  getPremiumStatus(): void;
}

export class PureMain extends React.PureComponent<
  IMainStoreProps & IMainDispatchProps
> {
  public constructor(props: any) {
    super(props);
    getAuthenticationToken();
  }

  public componentDidMount() {
    if (this.props.currentUser !== undefined) {
      this.props.getLatestGraph(this.props.currentUser);
      this.props.getPremiumStatus();
      this.props.getAllRelationships();
    }
  }

  public render() {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {this.renderMobile()}
        {this.renderDesktop()}
      </div>
    );
  }

  private renderMobile() {
    return (
      <Mobile>
        <MobileView />
      </Mobile>
    );
  }

  private renderDesktop() {
    return (
      <Default>
        <AtlaspNavbar />
        {this.renderGraphAndInfo()}
      </Default>
    );
  }

  private renderGraphAndInfo = () => {
    return (
      <div className="graph-container flexbox-row">
        <div className="display-graph">
          <DisplayGraph />
        </div>
        <div className="info-graphic">
          <InfoPerson />
        </div>
      </div>
    );
  };
}

function mapStoreToProps(state: IStoreState): IMainStoreProps {
  return {
    currentUser: state.DatabaseReducer.currentUser
  };
}

function mapDispatchToProps(dispatch: Dispatch): IMainDispatchProps {
  const databaseDispatcher = new DatabaseDispatcher(dispatch);
  return {
    getAllRelationships: databaseDispatcher.getAllRelationships,
    getLatestGraph: databaseDispatcher.getLatestGraph,
    getPremiumStatus: databaseDispatcher.checkPremiumStatus
  };
}

export const Main = connect(
  mapStoreToProps,
  mapDispatchToProps
)(PureMain);
