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
  public componentWillReceiveProps(nextProps: IAppProps){
    this.setState({ googleSheetData: nextProps.googleSheetData })
  }

  public render() {
    console.log(this.props)
    return (
      <div>
        <Button onClick={ this.fetchGoogleSheetsData } text='Refresh Data' />
      </div>
    );
  }

  private fetchGoogleSheetsData = () => {
    this.props.fetchGoogleSheetData()
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
