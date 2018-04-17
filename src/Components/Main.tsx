import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Button, Intent, Spinner } from '@blueprintjs/core';

import '../App.css';
import './Main.css';

import { fetchGoogleSheetData } from '../State/Actions';
import IStoreState from '../State/IStoreState';

import { assembleObjects } from '../Helpers/Assembler';

interface IMainProps {
  readonly fetching: boolean;
  readonly userData?: string[][];
  readonly eventData?: string[][];
  readonly googleSheetDataError?: any,
  fetchGoogleSheetData: () => (dispatch: Dispatch<IStoreState>) => void,
}

class Main extends React.Component<IMainProps> {
  public componentWillReceiveProps(nextProps: IMainProps){
    this.assembleData(nextProps.userData, nextProps.eventData)
  }

  public render() {
    return (
      <div>
        <Button className='top-left-fix' onClick={ this.fetchGoogleSheetsData } intent={ Intent.SUCCESS } text='Refresh Data' />
        { this.props.fetching && <Spinner className='centered' /> }
      </div>
    )
  }

  private fetchGoogleSheetsData = () => {
    this.props.fetchGoogleSheetData()
  }

  private assembleData = (userData?: string[][], eventData?: string[][]) => {
    if(userData && eventData){
      assembleObjects(userData, eventData)
    }
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
