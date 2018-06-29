import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import User from "../Helpers/User";
import { fetchGoogleSheetData } from "../State/GoogleSheetActions";
import IStoreState from "../State/IStoreState";
import { SetInfoPerson, SetMainPerson } from "../State/WebsiteActions";
import { DisplayGraph } from "./DisplayGraph";
import { InfoGraphic } from "./InfoGraphic";
import "./Main.css";
import { AtlaspNavbar } from "./Navbar";

interface IMainProps {
  readonly fetching: boolean;
  readonly googleSheetDataError?: any;
  readonly infoPerson?: User;
  readonly mainPerson?: User;
}

interface IMainState {
  mainPersonDialogOpen: boolean;
}

export interface IMainDispatchProps {
  fetchGoogleSheetData(): void;
  setInfoPerson(user: User): void;
  setMainPerson(user: User): void;
}

class PureMain extends React.Component<IMainProps & IMainDispatchProps, IMainState> {
  public render() {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <AtlaspNavbar />
        {this.renderGraphAndInfo()}
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
    if (this.props.mainPerson === undefined) {
      return null;
    }
    return <DisplayGraph />;
  }
}

function mapStateToProps(state: IStoreState) {
  return {
    fetching: state.GoogleReducer.isFetching,
    googleSheetDataError: state.GoogleReducer.googleSheetDataError,
    infoPerson: state.WebsiteReducer.infoPerson,
    mainPerson: state.WebsiteReducer.mainPerson,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    ...bindActionCreators({
      setInfoPerson: SetInfoPerson.create,
      setMainPerson: SetMainPerson.create,
    }, dispatch),
    fetchGoogleSheetData: fetchGoogleSheetData(dispatch),
  };
}

export const Main = connect(mapStateToProps, mapDispatchToProps)(PureMain);
