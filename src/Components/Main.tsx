import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import Event from '../Helpers/Event';
import User from '../Helpers/User';
import { fetchGoogleSheetData } from '../State/GoogleSheetActions';
import IStoreState from '../State/IStoreState';
import { SetInfoPerson, SetMainPerson } from '../State/WebsiteActions';
import { DisplayGraph } from './DisplayGraph';
import { InfoGraphic } from './InfoGraphic';
import './Main.css';
import { AtlaspNavbar } from "./Navbar";

interface IMainProps {
  readonly eventData?: { id: Event };
  readonly fetching: boolean;
  readonly googleSheetDataError?: any;
  readonly infoPerson?: User;
  readonly mainPerson?: User;
  
  readonly userData?: { id: User };
}

interface IMainState {
  mainPersonDialogOpen: boolean;
}

export interface IMainDispatchProps {
  fetchGoogleSheetData(): void;
  setInfoPerson(user: User): void;
  setMainPerson(user: User): void;
}

class PureMain extends React.Component<IMainProps & IMainDispatchProps, IMainState> {
  public render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {this.renderNavbar()}
        {this.renderGraphAndInfo()}
      </div>
    )
  }

  private renderNavbar(){
    return <AtlaspNavbar />
  }

  private renderGraphAndInfo = () => {
    if (this.props.userData === undefined || this.props.eventData === undefined) {
      return null
    }
    return(
      <div className='graph-container flexbox-row'>
        <div style={{ display: 'flex', flexBasis: '85%' }}>
          {this.props.mainPerson && <DisplayGraph mainPerson={this.props.mainPerson} eventData={this.props.eventData} userData={this.props.userData} />}
        </div>
        <div style={{ display: 'flex', flexBasis: '15%' }}>
          <InfoGraphic />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: IStoreState) {
  return {
    eventData: state.GoogleReducer.eventData,
    fetching: state.GoogleReducer.isFetching,
    googleSheetDataError: state.GoogleReducer.googleSheetDataError,
    infoPerson: state.WebsiteReducer.infoPerson,
    mainPerson: state.WebsiteReducer.mainPerson,
    userData: state.GoogleReducer.userData,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    ...bindActionCreators({
      setInfoPerson: SetInfoPerson.create,
      setMainPerson: SetMainPerson.create
    }, dispatch),
    fetchGoogleSheetData: fetchGoogleSheetData(dispatch),
  };
}

export const Main = connect(mapStateToProps, mapDispatchToProps)(PureMain);
