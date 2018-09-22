import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Spinner, Toaster } from "@blueprintjs/core";

import { EmptyDatabaseCache } from "./State/DatabaseActions";
import IStoreState from "./State/IStoreState";
import { setToast } from "./Utils/Toaster";

import "./AtlasP.css";

export interface IAppStoreProps {
  fetching: boolean;
  isLoggedIn: boolean;
}

export interface IAppDispatchProps {
  emptyCache(): void;
}

export interface IAppState {
  Element: React.ComponentClass;
  hasErrored: boolean;
}

class PureAtlasP extends React.PureComponent<IAppStoreProps & IAppDispatchProps, IAppState> {
  public state = {
    Element: Spinner,
    hasErrored: false,
  };

  private refHandler = {
      toaster: setToast,
  };

  public componentWillMount() {
    this.checkWhichComponent(this.props.isLoggedIn);
  }

  public componentWillReceiveProps(nextProps: IAppStoreProps & IAppDispatchProps) {
    if (this.props.isLoggedIn !== nextProps.isLoggedIn) {
      this.checkWhichComponent(nextProps.isLoggedIn);
    }
  }

  public componentDidCatch(error: any, info: any) {
    console.error(error, info);
    this.setState({ hasErrored: true });
  }

  public render() {
    if (this.state.hasErrored) {
      this.handleErroredOut();
    }

    const { Element } = this.state;
    return (
      <div className="prevent-movement">
        <Element />
        <Toaster ref={this.refHandler.toaster} />
      </div>
    );
  }

  private async checkWhichComponent(isLoggedIn: boolean) {
    if (!isLoggedIn) {
      const loginElement = await import("./Components/Login/Login");
      this.setState({ Element: loginElement.LoginComponent });
      return;
    }
    const mainElement = await import("./Components/Main");
    this.setState({ Element: mainElement.Main });
  }

  private handleErroredOut() {
    this.props.emptyCache();
    return <div className="centered">Rats, look like you found a bug. We've emptied the cache - try refreshing the page?</div>
  }
}

function mapStateToProps(state: IStoreState): IAppStoreProps {
  return {
    fetching: state.DatabaseReducer.isFetching,
    isLoggedIn: state.DatabaseReducer.isLoggedIn,
  };
}

function mapDispatchToProps(dispatch: Dispatch): IAppDispatchProps {
  return bindActionCreators({ emptyCache: EmptyDatabaseCache.create }, dispatch)
}

export const AtlasP = connect(mapStateToProps, mapDispatchToProps)(PureAtlasP);
