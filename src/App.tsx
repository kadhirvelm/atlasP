import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import './App.css'

import { Button, Intent, Spinner } from '@blueprintjs/core';
import Main from './Components/Main';
import { changeSignInStatus } from './State/Actions';
import IStoreState from './State/IStoreState';

import * as _ from 'underscore';

interface IAppProps {
  readonly fetching: boolean;
  readonly isSignedIn?: boolean,
  changeSignInStatus: (isSignedIn: boolean) => (dispatch: Dispatch<IStoreState>) => void,
}

class App extends React.Component<IAppProps> {
  public componentWillMount(){
    this.authorize()
  }

  public render() {
    return (
      <div className='prevent-movement'>
        { _.isUndefined(this.props.isSignedIn) ?
          <Spinner className='centered' />
          :
          !this.props.isSignedIn ? <Button id='authorize-button' onClick={ this.handleSignIn } text='Sign In' intent={ Intent.PRIMARY } className='centered fade-in' /> : <div />
        }
        { this.props.isSignedIn && <Main /> }
      </div>
    )
  }

  private authorize = () => {
    window['gapi'].load('client:auth2', () => {
      window['gapi'].client.init({
          apiKey: process.env.REACT_APP_API_KEY,
          clientId: process.env.REACT_APP_CLIENT_ID,
          discoveryDocs: [ 'https://sheets.googleapis.com/$discovery/rest?version=v4' ],
          scope: 'https://www.googleapis.com/auth/spreadsheets.readonly'
        }).then(() => {
          window['gapi'].auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
          this.updateSigninStatus(window['gapi'].auth2.getAuthInstance().isSignedIn.get());
      })
    })
  }

  private updateSigninStatus = (isSignedIn: boolean) => {
    this.props.changeSignInStatus(isSignedIn)
  }

  private handleSignIn = () => {
    window['gapi'].auth2.getAuthInstance().signIn()
  }
}

function mapStateToProps(state: IStoreState) {
  return {
    fetching: state.fetching,
    isSignedIn: state.isSignedIn,
  };
}

function mapDispatchToProps(dispatch: Dispatch<IStoreState>) {
  return {
    changeSignInStatus: bindActionCreators(changeSignInStatus, dispatch),
  };
}

export default connect<{}, {}, IAppProps>(mapStateToProps, mapDispatchToProps)(App) as React.ComponentClass<{}>;
