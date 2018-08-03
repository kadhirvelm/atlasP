import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Button, Intent, Spinner } from "@blueprintjs/core";

import { Main } from "./Components/Main";
import { GoogleDispatcher } from "./Dispatchers/GoogleDispatcher";
import { ChangeSignIn } from "./State/GoogleSheetActions";
import IStoreState from "./State/IStoreState";

import "./App.css";

export interface IAppProps {
  readonly fetching: boolean;
  readonly isSignedIn?: boolean;
}

export interface IAppDispatchProps {
  authorize(callback: (isSignedIn: boolean, currentUser: any, isAdmin: boolean | string) => void): void;
  changeSignInStatus(signIn: { isSignedIn: boolean, currentUser: any, isAdmin: boolean }): void;
  signIn(): void;
}

class PureApp extends React.PureComponent<IAppProps & IAppDispatchProps> {
  public state = {
    receivedUpdate: false,
  };

  public componentDidMount() {
    this.props.authorize(this.updateSigninStatus);
  }

  public render() {
    return (
      <div className="prevent-movement">
        {this.renderMainPage()}
      </div>
    );
  }

  private renderMainPage() {
    if (!this.state.receivedUpdate) {
      return <Spinner className="centered" />;
    }
    return this.renderSignedInPage();
  }

  private renderSignedInPage() {
    if (this.props.isSignedIn) {
      return <Main />;
    }
    return (
      <Button
        id="authorize-button"
        onClick={this.props.signIn}
        text="Sign In"
        intent={Intent.PRIMARY}
        className="centered fade-in"
      />
    );
  }

  private updateSigninStatus = (isSignedIn: boolean, currentUser: any, isAdmin: boolean) => {
    this.setState({ receivedUpdate: true }, () => {
      this.props.changeSignInStatus({ isSignedIn, currentUser,  isAdmin });
    });
  }
}

function mapStateToProps(state: IStoreState) {
  return {
    fetching: state.GoogleReducer.isFetching,
    isSignedIn: state.GoogleReducer.isSignedIn,
  };
}

function mapDispatchToProps(dispatch: Dispatch): IAppDispatchProps {
  const googleDispatcher = new GoogleDispatcher(dispatch);
  return {
    authorize: googleDispatcher.authorize,
    ...bindActionCreators({ changeSignInStatus: ChangeSignIn.create }, dispatch),
    signIn: googleDispatcher.signIn,
  }
}

export const App = connect(mapStateToProps, mapDispatchToProps)(PureApp);
