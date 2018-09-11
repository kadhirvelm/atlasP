import * as React from "react";
import { connect } from "react-redux";
import Responsive from "react-responsive";
import { bindActionCreators, Dispatch } from "redux";

import IStoreState from "../State/IStoreState";
import { SetMainPerson } from "../State/WebsiteActions";
import { getAuthenticationToken } from "../Utils/Security";
import { DisplayGraph } from "./DisplayGraph/DisplayGraph";
import { InfoGraphic } from "./InfoGraphic/InfoGraphic";
import { MobileView } from "./Mobile/MobileView";
import { AtlaspNavbar } from "./Navbar/Navbar";

import "./Main.css";

interface IMainProps {
  isAdmin?: boolean;
}

const Default = (props: any) => <Responsive {...props} minWidth={768} />;
const Mobile = (props: any) => <Responsive {...props} maxWidth={767} />;

class PureMain extends React.Component<IMainProps> {

  public constructor(props: IMainProps) {
    super(props);
    getAuthenticationToken();
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
          <DisplayGraph />
        </div>
        <div style={{ display: "flex", flexBasis: "15%" }}>
          <InfoGraphic />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IStoreState) {
  return {
    isAdmin: state.GoogleReducer.isAdmin,
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
