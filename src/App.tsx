import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Button } from '@blueprintjs/core';

import { fetchGoogleSheetData } from './State/Actions';
import IStoreState from './State/IStoreState';

interface IAppProps {
  readonly fetching: boolean;
  readonly googleSheetData?: any[];
  readonly googleSheetDataError?: any;
  fetchGoogleSheetData: () => (dispatch: Dispatch<IStoreState>) => void;
}

class App extends React.Component<IAppProps> {
  public componentWillMount(){
    this.authorize()
  }

  public componentWillReceiveProps(nextProps: IAppProps){
    this.setState({ googleSheetData: nextProps.googleSheetData, googleSheetDataError: nextProps.googleSheetDataError })
  }

  public render() {
    return (
      <div>
        <Button onClick={ this.fetchGoogleSheetsData } text='Refresh Data' />
        <div color='red'> { this.props.googleSheetDataError && this.props.googleSheetDataError.result.error.message } </div>
        <button id="authorize-button" onClick={ this.handleSignIn } style={ { display: 'block' } }>Authorize</button>
        <button id="signout-button" style={ { display: 'block' } }>Sign Out</button>
      </div>
    );
  }

  private authorize = () => {
    window['gapi'].load('client:auth2', () => {
      window['gapi'].client.init({
          apiKey: 'AIzaSyA_CLYOdcIFubupi3CiUiwOl7jC21Ntn0g',
          clientId: '826952396520-1kpdq0jbso689jldpfou2v7mevjf5u1h.apps.googleusercontent.com',
          discoveryDocs: [ 'https://sheets.googleapis.com/$discovery/rest?version=v4' ],
          scope: 'https://www.googleapis.com/auth/spreadsheets.readonly'
        }).then(() => {
            window['gapi'].auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
            this.updateSigninStatus(window['gapi'].auth2.getAuthInstance().isSignedIn.get());
        });
      });
  }

  private updateSigninStatus = (isSignedIn: boolean) => {
    console.log(isSignedIn)
  }

  private fetchGoogleSheetsData = () => {
    this.props.fetchGoogleSheetData()
  }

  private handleSignIn = () => {
    window['gapi'].auth2.getAuthInstance().signIn();
  }
}

function mapStateToProps(state: IStoreState) {
  return {
    fetching: state.fetching,
    googleSheetData: state.googleSheetData,
    googleSheetDataError: state.googleSheetDataError,
  };
}

function mapDispatchToProps(dispatch: Dispatch<IStoreState>) {
  return {
    fetchGoogleSheetData: bindActionCreators(fetchGoogleSheetData, dispatch)
  };
}

export default connect<{}, {}, IAppProps>(mapStateToProps, mapDispatchToProps)(App) as React.ComponentClass<{}>;
