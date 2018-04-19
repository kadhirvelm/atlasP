import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Alignment, Button, Classes, Dialog, Intent, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, Spinner } from '@blueprintjs/core';

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

interface IState {
  mainPersonDialog: boolean;
}

class Main extends React.Component<IMainProps, IState> {
  public state = {
    mainPersonDialog: false
  }

  public render() {
    return (
      <div style={ { display: 'flex', flexDirection: 'column' } }>
        { this.renderNavbar() }
        { this.renderNewPersonDialog() }
        <div className='graph-container' style={ { display: 'flex', flexGrow: 1 } }> { (this.props.userData && this.props.eventData) && <DisplayGraph eventData={ this.props.eventData } userData={ this.props.userData } /> } </div>
      </div>
    )
  }

  private renderNavbar(){
    return(
      <Navbar className='pt-dark' style={ { zIndex: 10 } }>
        <NavbarGroup align={ Alignment.LEFT }>
          <NavbarHeading> Goe V2 </NavbarHeading>
          <NavbarDivider />
          <Button icon='refresh' onClick={ this.fetchGoogleSheetsData } text='Refresh Data' />
          { this.props.fetching && <Spinner className='pt-small' intent={ Intent.WARNING } /> }
          <Button onClick={ this.changeMainPersonDialog } text='Fetch User' />
        </NavbarGroup>
        <NavbarGroup align={ Alignment.RIGHT }>
          <Button icon='log-out' onClick={ this.handleSignOut } />
        </NavbarGroup>
      </Navbar>
    )
  }

  private handleMainPersonDialogClose = () => {
    this.setState({ mainPersonDialog: false })
  }

  private renderNewPersonDialog(){
    return(
      <Dialog hasBackdrop={ false } usePortal={ false } icon='inbox' isOpen={ this.state.mainPersonDialog } onClose={ this.handleMainPersonDialogClose } title='Fetch Specific Person'>
        <div className={ Classes.DIALOG_BODY }> Select person: </div>
        <div className={ Classes.DIALOG_FOOTER }>
          <div className={ Classes.DIALOG_FOOTER_ACTIONS }>
            <Button text='Cancel' onClick={ this.handleMainPersonDialogClose } />
            <Button intent={ Intent.PRIMARY } text='Primary' />
          </div>
        </div>
      </Dialog>
    )
  }

  private handleSignOut = () => {
    window['gapi'].auth2.getAuthInstance().signOut()
  }

  private changeMainPersonDialog = () => {
    this.setState({ mainPersonDialog: true })
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
