import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Button, Dialog, Icon, Intent, Popover, Position } from '@blueprintjs/core';

import Event from '../Helpers/Event';
import { calculateScore, IScore } from '../Helpers/GraphHelpers';
import User from '../Helpers/User';
import IStoreState from '../State/IStoreState';
import { SetInfoPerson, SetMainPerson, ChangeParty } from '../State/WebsiteActions';
import { ScoreDisplay } from "./ScoreDisplay";

import './InfoGraphic.css';

interface IInfoGraphicProps {
    infoPerson: User;
    mainPerson: User;
    party: string[];
    userData: { id: User },
    eventData: { id: Event },
}

interface IStateProps {
    openDialog: boolean,
    openInformationPopover: boolean,
    openPopover: boolean,
}

export interface IInfoGraphDispatchProps {
    setParty(party: string[]): void;
    setInfoPerson(user: User): void;
    setMainPerson(user: User): void;
}

class PureInfoGraphic extends React.Component<IInfoGraphicProps & IInfoGraphDispatchProps, IStateProps> {
    public state = {
        openDialog: false,
        openInformationPopover: false,
        openPopover: false,
    }

    public componentWillMount(){
      this.renderSingleIndividual = this.renderSingleIndividual.bind(this)
    }

    public render(){
        return(
            <div className='info-graphic flexbox-column pt-dark' style={{ padding: '15px' }}>
                {this.renderCurrentDinnerParty()}
                {this.renderPerson(this.props.infoPerson)}
                {this.renderInformationDialogOnPerson()}
            </div>
        )
    }

    private makeInfoPerson(user: User){
      return () => this.props.setInfoPerson(user)
    }
    
    private removePerson(user: User){
      return () => this.props.setParty(_.filter(this.props.party, (id) => parseInt(id, 10) !== user.id))
    }

    private renderSingleIndividual(id: string){
      const user = this.props.userData && this.props.userData[id]
      if (user == null) {
          return null;
      }
      return(
        <div key={id} style={{ position: 'relative', fontSize: '1vw' }} className='user-display'>
            <div className='user-div'>
                <div> {user.name} </div>
            </div>
            <button onClick={this.makeInfoPerson(user)} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 2, background: 'transparent', border: 'none' }} />
            <Button className='removal-button' icon='cross' onClick={this.removePerson(user)} />
        </div>
      )
    }

    private receiveNewPerson = (event: any) => {
        event.preventDefault()
        this.props.setParty(_.uniq((this.props.party || []).concat(event.dataTransfer.getData('text').split('_')[1])))
    }

    private preventDefault(event: any){
        event.preventDefault()
    }

    private renderCurrentDinnerParty(){
        return(
            <div className='flexbox-column' style={{ position: 'relative', flexBasis: '60%' }} onDrop={this.receiveNewPerson} onDragOver={this.preventDefault}>
                <h4> Current Party </h4>
                <div className='party-holder'>
                    {this.props.party ? this.props.party.map(this.renderSingleIndividual) : <div />}
                </div>
            </div>
        )
    }

    private openPopoverHover = () => this.setState({ openPopover: true })
    private closePopoverHover = () => this.setState({ openPopover: false })

    private openInformationDialog = () => this.setState({ openDialog: true })
    private closeInformationDialog = () => this.setState({ openDialog: false })

    private openInformationHover = () => this.setState({ openInformationPopover: true })
    private closeInformationHover = () => this.setState({ openInformationPopover: false })

    private renderInformationDialogOnPerson(){
        if (!((this.props.infoPerson && this.props.mainPerson && this.props.userData))) {
            return null;
        }
        return(
            <Dialog icon='person' isOpen={this.state.openDialog} onClose={this.closeInformationDialog} title={(this.props.infoPerson ? this.props.infoPerson.name : '') + ' with ' + (this.props.mainPerson.name)}>
                <div className='pt-dialog-body flexbox-column'>
                    <div className='flexbox-row' style={{ flexGrow: 1, marginBottom: '15px' }}>
                        <u className='flex-basis flex-basis-20'>ID</u>
                        <u className='flex-basis flex-basis-15'>Host</u>
                        <u className='flex-basis flex-basis-35'>Description</u>
                        <u className='flex-basis flex-basis-15'>Date</u>
                        <u className='flex-basis flex-basis-15' style={{ justifyContent: 'center' }}>People</u>
                    </div>
                    {this.renderInfoPersonContent()}
                </div>
            </Dialog>
        )
    }

    private renderInfoPersonContent() {
        if (this.props.infoPerson === undefined || this.props.mainPerson === undefined) {
            return null;
        }
        const connectionsToMainPerson = this.props.infoPerson.connections[this.props.mainPerson.id]

        if(connectionsToMainPerson === undefined) {
            return null;
        }

        return connectionsToMainPerson.map((eventID: number, index: number) => {
                const event: Event = this.props.eventData && this.props.eventData[eventID]
                return this.renderEventStuff(event, index)
            })
    }

    private renderEventStuff(event: Event, index: number) {
        if (this.props.userData === undefined) {
            return null;
        }
        return (
            <div key={index} className='flexbox-row' style={{ flexGrow: 1 }}>
                <div className='flex-basis flex-basis-20'>
                    {event.id}
                </div>
                <div className='flex-basis flex-basis-15'>
                    {this.props.userData && this.props.userData[event.host].name}
                </div>
                <div className='flex-basis flex-basis-35' style={{ wordWrap: 'break-word' }}>
                    {event.description}
                </div>
                <div className='flex-basis flex-basis-15'>
                    {event.date}
                </div>
                <div className='flex-basis flex-basis-15' style={{ justifyContent: 'center' }}>
                    <Popover isOpen={this.state.openInformationPopover} position={Position.RIGHT}>
                        <Icon onMouseEnter={this.openInformationHover} onMouseLeave={this.closeInformationHover} icon='people' />
                        <div style={{ padding: '15px', textAlign: 'center' }}>
                            <div className='flexbox-column'>
                                {event.attendees.map((id: number) => (<div key={id}> {this.props.userData && this.props.userData[id].name} ({id}) </div>))}
                            </div>
                        </div>
                    </Popover>
                </div>
            </div>
        )
    }

    private renderPerson(user?: User){
        if (user === undefined) {
            return this.renderNoPerson()
        }
        return(
            <div className='flexbox-column info-person'>
                <div key={user.id} className='show-change'>
                    <div className='flexbox-row' style={{ justifyContent: 'center', alignContent: 'center', height: '100%', width: '100%', position: 'relative' }}>
                        <div style={{ fontSize: '1.5vw' }}> {user.name} </div>
                        <Popover isOpen={this.state.openPopover}>
                            <div style={{ marginLeft: '15px', top: '50%', position: 'absolute', transform: 'translateY(-50%)' }}>
                                <Icon onMouseEnter={this.openPopoverHover} onMouseLeave={this.closePopoverHover} onClick={this.openInformationDialog} icon='help' />
                            </div>
                            <div style={{ padding: '15px', textAlign: 'center' }} className={user.gender === 'M' ? 'blue-box' : 'red-box'}>
                                <div className='padding-box'> {user.fullName} ({user.id}) </div>
                                <div className='padding-box'> {user.contact} </div>
                                <div className='padding-box'> {user.age}, {user.location} </div>
                            </div>
                        </Popover>
                    </div>
                    {this.renderScore(user)}
                    <div style={{ position: 'absolute', left: '50%', bottom: '1%', transform: 'translate(-50%, -1%)' }}>
                        <Button icon='exchange' text={'Make ' + user.name + ' Main'} onClick={this.setMainPerson} intent={Intent.WARNING} className='grow' />
                    </div>
                </div>
            </div>
        )
    }

    private renderNoPerson() {
        return (
            <div className='flexbox-column info-person'>
                <div key='Unknown' className='show-change'>
                    <div className='flexbox-row' style={{ justifyContent: 'center' }}>
                        <h4> None Selected </h4>
                    </div>
                </div>
            </div>
        )
    }

    private renderScore(user: User){
        const score: IScore | null = ((this.props.mainPerson && (user.id !== this.props.mainPerson.id)) && calculateScore(user, this.props.mainPerson)) || null
        return <ScoreDisplay score={score} />
    }

    private setMainPerson = () => this.props.infoPerson && this.props.setMainPerson && this.props.setMainPerson(this.props.infoPerson)
}

function mapStateToProps(state: IStoreState) {
  return {
    eventData: state.GoogleReducer.eventData,
    infoPerson: state.WebsiteReducer.infoPerson,
    mainPerson: state.WebsiteReducer.mainPerson,
    party: state.WebsiteReducer.party,
    userData: state.GoogleReducer.userData,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({ setInfoPerson: SetInfoPerson.create, setMainPerson: SetMainPerson.create, setParty: ChangeParty.create }, dispatch);
}

export const InfoGraphic = connect(mapStateToProps, mapDispatchToProps)(PureInfoGraphic);
