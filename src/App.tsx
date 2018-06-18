import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Button, Intent, Spinner } from "@blueprintjs/core";

import { Main } from "./Components/Main";
import { ChangeSignIn } from "./State/GoogleSheetActions";
import IStoreState from "./State/IStoreState";

import "./App.css";

export interface IAppProps {
  readonly fetching: boolean;
  readonly isSignedIn?: boolean;
}

export interface IAppDispatchProps {
  changeSignInStatus(isSignedIn: boolean): void;
}

class PureApp extends React.PureComponent<IAppProps & IAppDispatchProps> {
  public state = {
    receivedUpdate: false
  };

  public componentWillMount() {
    this.authorize();
  }

  public render() {
    return (
      <div className="prevent-movement">
        {this.renderMainPage()}
      </div>
    );
  }

  private renderMainPage(){
    if (!this.state.receivedUpdate) {
      return <Spinner className="centered" />;
    }
    return this.renderSignedInPage();
  }

  private renderSignedInPage(){
    if(this.props.isSignedIn){
      return <Main />
    }
    return (
      <Button
        id="authorize-button"
        onClick={this.handleSignIn}
        text="Sign In"
        intent={Intent.PRIMARY}
        className="centered fade-in"
      />
    );
  }

  private authorize = () => {
    window["gapi"].load("client:auth2", () => {
      window["gapi"].client
        .init({
          apiKey: process.env.REACT_APP_API_KEY,
          clientId: process.env.REACT_APP_CLIENT_ID,
          discoveryDocs: [
            "https://sheets.googleapis.com/$discovery/rest?version=v4"
          ],
          scope: "https://www.googleapis.com/auth/spreadsheets.readonly"
        })
        .then(() => {
          window["gapi"].auth2
            .getAuthInstance()
            .isSignedIn.listen(this.updateSigninStatus);
          this.updateSigninStatus(
            window["gapi"].auth2.getAuthInstance().isSignedIn.get()
          );
        });
    });
  };

  private updateSigninStatus = (isSignedIn: boolean) => {
    this.setState({ receivedUpdate: true }, () => {
      this.props.changeSignInStatus(isSignedIn);
    });
  };

  private handleSignIn = () => {
    window["gapi"].auth2.getAuthInstance().signIn();
  };
}

function mapStateToProps(state: IStoreState) {
  return {
    fetching: state.GoogleReducer.isFetching,
    isSignedIn: state.GoogleReducer.isSignedIn
  };
}

function mapDispatchToProps(dispatch: Dispatch): IAppDispatchProps {
  return bindActionCreators({ changeSignInStatus: ChangeSignIn.create }, dispatch)
}

export const App = connect(mapStateToProps, mapDispatchToProps)(PureApp);
