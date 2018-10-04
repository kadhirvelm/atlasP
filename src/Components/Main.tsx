import * as React from "react";
import { connect } from "react-redux";
import Responsive from "react-responsive";
import { Dispatch } from "redux";

import { DatabaseDispatcher } from "../Dispatchers/DatabaseDispatcher";
import IStoreState from "../State/IStoreState";
import { IUser } from "../Types/Users";
import { getAuthenticationToken } from "../Utils/Security";
import { DisplayGraph } from "./DisplayGraph/DisplayGraph";
import { InfoGraphic } from "./Informational/InfoGraphic";
import { MobileView } from "./Mobile/MobileView";
import { AtlaspNavbar } from "./Navbar/Navbar";

import "./Main.css";

const Default = (props: any) => <Responsive {...props} minWidth={768} />;
const Mobile = (props: any) => <Responsive {...props} maxWidth={767} />;

export interface IMainStoreProps {
  currentUser: IUser | undefined;
};

export interface IMainDispatchProps {
  getLatestGraph(user: IUser): void;
};

export class PureMain extends React.Component<IMainStoreProps & IMainDispatchProps> {

  public constructor(props: any) {
    super(props);
    getAuthenticationToken();
  }

  public componentDidMount() {
    if (this.props.currentUser !== undefined) {
        this.props.getLatestGraph(this.props.currentUser);
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
        <div className="display-graph">
          <DisplayGraph />
        </div>
        <div className="info-graphic">
          <InfoGraphic />
        </div>
      </div>
    );
  }
}

function mapStoreToProps(state: IStoreState): IMainStoreProps {
  return {
    currentUser: state.DatabaseReducer.currentUser,
  }
}

function mapDispatchToProps(dispatch: Dispatch): IMainDispatchProps {
  return {
    getLatestGraph: new DatabaseDispatcher(dispatch).getLatestGraph,
  }
}

export const Main = connect(mapStoreToProps, mapDispatchToProps)(PureMain);
