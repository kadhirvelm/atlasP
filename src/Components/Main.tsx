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
  readonly googleSheetData?: object;
  readonly googleSheetDataError?: any,
  fetchGoogleSheetData: () => (dispatch: Dispatch<IStoreState>) => void,
}

class Main extends React.Component<IMainProps> {
  public componentWillReceiveProps(nextProps: IMainProps){
    this.assembleData(nextProps.googleSheetData)
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

  private assembleData = (googleSheetData?: object) => {
    if(googleSheetData){
      console.log(assembleObjects(googleSheetData['result'].values))
    }
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

export default connect<{}, {}, IMainProps>(mapStateToProps, mapDispatchToProps)(Main) as React.ComponentClass<{}>;
