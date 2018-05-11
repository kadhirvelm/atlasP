import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Alignment, Button, Intent, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, Spinner } from '@blueprintjs/core';

import Event from '../Helpers/Event';
import User from '../Helpers/User';
import { fetchGoogleSheetData } from '../State/GoogleSheetActions';
import IStoreState from '../State/IStoreState';
import { setInfoPerson, setMainPerson } from '../State/WebsiteActions';

import DisplayGraph from './DisplayGraph';
import FetchPerson from './FetchPerson';
import InfoGraphic from './InfoGraphic';
import './Main.css';

interface IMainProps {
  readonly eventData?: { id: Event };
  fetchGoogleSheetData: () => (dispatch: Dispatch<IStoreState>) => void;
  readonly fetching: boolean;
  readonly googleSheetDataError?: any;
  readonly infoPerson?: User;
  readonly mainPerson?: User;
  setInfoPerson: (user: User) => (dispatch: Dispatch<IStoreState>) => void;
  setMainPerson: (user: User) => (dispatch: Dispatch<IStoreState>) => void;
  readonly userData?: { id: User };
}

interface IMainState {
  mainPersonDialogOpen: boolean;
}

class Main extends React.Component<IMainProps, IMainState> {
  public state = {
    mainPersonDialogOpen: false
  }

  public render() {
    return (
      <div style={ { display: 'flex', flexDirection: 'column' } }>
        { this.renderNavbar() }
        { this.renderNewPersonDialog() }
        { this.renderGraphAndInfo() }
      </div>
    )
  }

  private openChangeMainPersonDialog = () => {
    this.setState({ mainPersonDialogOpen: true })
  }

  private handleMainPersonDialogClose = () => {
    this.setState({ mainPersonDialogOpen: false })
  }

  private openSheet(){
    window.open('https://docs.google.com/spreadsheets/d/1fsQHaT2ZG1uRKmuHagoUjReNMpFH3_fSGw9HLLcphIg/edit#gid=123656038', '_blank')
  }

  private renderNavbar(){
    return(
      <Navbar className='pt-dark' style={ { zIndex: 10 } }>
        <NavbarGroup align={ Alignment.LEFT }>
          <NavbarHeading> Fika V2 </NavbarHeading>
          <NavbarDivider />
          <Button icon='refresh' onClick={ this.fetchGoogleSheetsData } text='Refresh Data' intent={ (this.props.userData && Object.keys(this.props.userData).length) ? Intent.NONE : Intent.DANGER }/>
          { this.props.fetching && <Spinner className='pt-small' intent={ Intent.WARNING } /> }
          <Button icon='exchange' onClick={ this.openChangeMainPersonDialog } text='Change User' />
        </NavbarGroup>
        <NavbarGroup align={ Alignment.RIGHT }>
          <Button icon='link' text='Google Sheet' onClick={ this.openSheet } />
          <Button icon='log-out' onClick={ this.handleSignOut } />
        </NavbarGroup>
      </Navbar>
    )
  }

  private renderNewPersonDialog(){
    return this.props.userData ? <FetchPerson handleMainPersonDialogClose={ this.handleMainPersonDialogClose } mainPersonDialogOpen={ this.state.mainPersonDialogOpen } mainPerson={ this.props.mainPerson } setMainPerson={ this.props.setMainPerson } userData={ this.props.userData } /> : <div />
  }

  private renderGraphAndInfo = () => {
    return(
      <div className='graph-container flexbox-row'>
        <div style={ { display: 'flex', flexBasis: '85%' } }>
            { (this.props.userData && this.props.eventData) ? <DisplayGraph mainPerson={ this.props.mainPerson } setMainPerson={ this.props.setMainPerson } eventData={ this.props.eventData } userData={ this.props.userData } setInfoPerson={ this.props.setInfoPerson } /> : <div /> }
        </div>
        <div style={ { display: 'flex', flexBasis: '15%' } }>
          { (this.props.userData) && <InfoGraphic /> }
        </div>
      </div>
    )
  }

  private handleSignOut = () => {
    window['gapi'].auth2.getAuthInstance().signOut()
  }

  private fetchGoogleSheetsData = () => {
    this.props.fetchGoogleSheetData()
  }
}

function mapStateToProps(state: IStoreState) {
  return {
    eventData: state.GoogleReducer.eventData,
    fetching: state.GoogleReducer.fetching,
    googleSheetDataError: state.GoogleReducer.googleSheetDataError,
    infoPerson: state.WebsiteReducer.infoPerson,
    mainPerson: state.WebsiteReducer.mainPerson,
    userData: state.GoogleReducer.userData,
  };
}

function mapDispatchToProps(dispatch: Dispatch<IStoreState>) {
  return {
    fetchGoogleSheetData: bindActionCreators(fetchGoogleSheetData, dispatch),
    setInfoPerson: bindActionCreators(setInfoPerson, dispatch),
    setMainPerson: bindActionCreators(setMainPerson, dispatch),
  };
}

export default connect<{}, {}, IMainProps>(mapStateToProps, mapDispatchToProps)(Main) as React.ComponentClass<{}>;
