import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Button, Intent, Spinner } from '@blueprintjs/core';

import '../App.css';
import DisplayGraph from './DisplayGraph';
import './Main.css';

import { fetchGoogleSheetData } from '../State/Actions';
import IStoreState from '../State/IStoreState';

interface IMainProps {
  readonly fetching: boolean;
  readonly userData?: string[][];
  readonly googleSheetDataError?: any,
  fetchGoogleSheetData: () => (dispatch: Dispatch<IStoreState>) => void,
}

class Main extends React.Component<IMainProps> {
  public render() {
    return (
      <div>
        <Button className='top-left-fix' onClick={ this.fetchGoogleSheetsData } intent={ Intent.SUCCESS } text='Refresh Data' />
        { this.props.fetching && <Spinner className='centered' /> }
        { this.props.userData && <DisplayGraph userData={ this.props.userData } /> }
      </div>
    )
  }

  private fetchGoogleSheetsData = () => {
    this.props.fetchGoogleSheetData()
  }
}

function mapStateToProps(state: IStoreState) {
  return {
    fetching: state.fetching,
    googleSheetDataError: state.googleSheetDataError,
    userData: state.userData,
  };
}

function mapDispatchToProps(dispatch: Dispatch<IStoreState>) {
  return {
    fetchGoogleSheetData: bindActionCreators(fetchGoogleSheetData, dispatch)
  };
}

export default connect<{}, {}, IMainProps>(mapStateToProps, mapDispatchToProps)(Main) as React.ComponentClass<{}>;
