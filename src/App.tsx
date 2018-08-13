import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Button, Intent, Spinner } from "@blueprintjs/core";

import { Main } from "./Components/Main";
import { GoogleDispatcher } from "./Dispatchers/GoogleDispatcher";
import { ChangeSignIn, EmptyGoogleCache } from "./State/GoogleSheetActions";
import IStoreState from "./State/IStoreState";

import "./App.css";

export interface IAppProps {
  fetching: boolean;
  isSignedIn?: boolean;
}

export interface IAppDispatchProps {
  authorize(callback: (isSignedIn: boolean, currentUser: any, isAdmin: boolean | string) => void): void;
  changeSignInStatus(signIn: { isSignedIn: boolean, currentUser: any, isAdmin: boolean }): void;
  emptyCache(): void;
  signIn(): void;
  signOut(): void;
}

export interface IAppState {
  hasErrored: boolean;
  receivedUpdate: boolean;
}

class PureApp extends React.PureComponent<IAppProps & IAppDispatchProps, IAppState> {
  public state = {
    hasErrored: false,
    receivedUpdate: false,
  };

  public componentDidMount() {
    this.props.authorize(this.updateSigninStatus);
  }

  public componentDidCatch(error: any, info: any) {
    console.error(error, info);
    this.setState({ hasErrored: true });
  }

  public render() {
    if (this.state.hasErrored) {
      this.props.signOut();
      this.props.emptyCache();
      return <div className="centered">Rats, look like you found a bug. We've emptied the cache - try refreshing the page?</div>
    }
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
      <div className="centered fade-in">
        <h3 className="header">Welcome to AtlasP</h3>
        <Button
          id="authorize-button"
          onClick={this.props.signIn}
          text="Sign In"
          intent={Intent.PRIMARY}
          className="center-button"
        />
      </div>
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
    ...bindActionCreators({ changeSignInStatus: ChangeSignIn.create, emptyCache: EmptyGoogleCache.create }, dispatch),
    signIn: googleDispatcher.signIn,
    signOut: googleDispatcher.signOut,
  }
}

export const App = connect(mapStateToProps, mapDispatchToProps)(PureApp);
