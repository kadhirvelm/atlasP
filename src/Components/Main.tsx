import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Button, Intent, Spinner } from '@blueprintjs/core';

import Event from '../Helpers/Event';
import User from '../Helpers/User';
import { fetchGoogleSheetData } from '../State/Actions';
import IStoreState from '../State/IStoreState';

import DisplayGraph from './DisplayGraph';
import './Main.css';

interface IMainProps {
  readonly eventData?: { id: Event },
  readonly fetching: boolean;
  readonly userData?: { id: User };
  readonly googleSheetDataError?: any,
  fetchGoogleSheetData: () => (dispatch: Dispatch<IStoreState>) => void,
}

class Main extends React.Component<IMainProps> {
  public render() {
    return (
      <div>
        <Button className='top-left-fix' onClick={ this.fetchGoogleSheetsData } intent={ Intent.SUCCESS } text='Refresh Data' />
        { this.props.fetching && <Spinner className='centered' /> }
        { (this.props.userData && this.props.eventData) && <div className='graph-container'> <DisplayGraph eventData={ this.props.eventData } userData={ this.props.userData } /> </div> }
      </div>
    )
  }

  private fetchGoogleSheetsData = () => {
    this.props.fetchGoogleSheetData()
  }
}

function mapStateToProps(state: IStoreState) {
  return {
    eventData: state.eventData,
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
