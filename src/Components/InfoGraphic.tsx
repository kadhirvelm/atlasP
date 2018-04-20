import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Button, Intent } from '@blueprintjs/core';

import { calculateScore, IScore } from '../Helpers/GraphHelpers';
import User from '../Helpers/User';
import IStoreState from '../State/IStoreState';

import { setInfoPerson, setMainPerson, setParty } from '../State/WebsiteActions'

import './InfoGraphic.css';

interface IInfoGraphicProps {
    infoPerson?: User;
    mainPerson?: User;
    party?: string[];
    userData?: { id: User },
    setParty: (party: string[]) => (dispatch: Dispatch<IStoreState>) => void;
    setInfoPerson: (user: User) => (dispatch: Dispatch<IStoreState>) => void;
    setMainPerson: (user: User) => (dispatch: Dispatch<IStoreState>) => void;
}

class InfoGraphic extends React.Component<IInfoGraphicProps, any> {
    public componentWillMount(){
      this.renderSingleIndividual = this.renderSingleIndividual.bind(this)
    }

    public render(){
        return(
            <div className='info-graphic flexbox-column pt-dark' style={ { padding: '15px' } }>
                { this.renderCurrentDinnerParty() }
                { this.props.infoPerson && this.renderPerson(this.props.infoPerson) }
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
      return(
        user ?
          <div key={ id } style={ { position: 'relative', fontSize: '1vw' } } className='user-display'>
            <div className='user-div'>
              <div> { user.name } </div>
            </div>
            <button onClick={ this.makeInfoPerson(user) } style={ { position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 2, background: 'transparent', border: 'none' } } />
            <Button className='removal-button' icon='cross' onClick={ this.removePerson(user) } />
          </div>
          :
          <div />
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
            <div className='flexbox-column' style={ { position: 'relative', flexBasis: '60%' } } onDrop={ this.receiveNewPerson } onDragOver={ this.preventDefault }>
                <h4> Current Party </h4>
                <div className='party-holder'>
                    { this.props.party ? this.props.party.map(this.renderSingleIndividual) : <div /> }
                </div>
            </div>
        )
    }

    private renderPerson(user: User){
        return(
            <div style={ { position: 'relative', flexBasis: '40%', marginTop: '15px', paddingTop: '15px', borderTop: 'solid 1px white' } } className='flexbox-column'>
                <div key={ user.id } className='show-change'>
                    <div className='flexbox-row' style={ { justifyContent: 'center' } }>
                        <h4> { user.name } ({ user.id }) </h4>
                    </div>
                    { this.renderScore(user) }
                    <div style={ { position: 'absolute', left: '50%', bottom: '1%', transform: 'translate(-50%, -1%)' } }>
                        <Button icon='exchange' text={ 'Make ' + user.name + ' Main' } onClick={ this.setMainPerson } intent={ Intent.WARNING } className='grow' />
                    </div>
                </div>
            </div>
        )
    }

    private renderScore(user: User){
        const score: IScore | boolean = ((this.props.mainPerson && (user.id !== this.props.mainPerson.id)) && calculateScore(user, this.props.mainPerson)) || false
        return(
            <div>
                { score ?
                    <div className='flexbox-column' style={ { flexGrow: 1 } }>
                        <div className='single-row'>
                            <div className='single-column label'>
                                Connections
                            </div>
                            <div className='single-column value'>
                                { score.eventScore }
                            </div>
                        </div>
                        <div className='single-row'>
                            <div className='single-column label'>
                                Gender
                            </div>
                            <div className='single-column value'>
                                { score.genderScore > 0 ? score.genderScore : '--' }
                            </div>
                        </div>
                        <div className='single-row'>
                            <div className='single-column label'>
                                Age
                            </div>
                            <div className='single-column value'>
                                { score.ageScore !== 0 ? score.ageScore : '--' }
                            </div>
                        </div>
                        <div className='single-row'>
                            <div className='single-column label'>
                                Like
                            </div>
                            <div className='single-column value'>
                                { score.likeScore > 1 ? score.likeScore : '--' }
                            </div>
                        </div>
                        <div className='single-row' style={ { borderBottom: 'dashed 0px black' } }>
                            <div className='single-column label'>
                                Dislike
                            </div>
                            <div className='single-column value'>
                                { score.dislikeScore < 1 ? score.dislikeScore : '--' }
                            </div>
                        </div>
                        <div className='single-row' style={ { paddingTop: '15px', borderTop: 'solid 2.5px white', borderBottom: 'dashed 0px black' } }>
                            <div className='single-column label'>
                                Final Score
                            </div>
                            <div className='single-column value'>
                                { score.finalScore }
                            </div>
                        </div>
                    </div>
                :
                <div />
                }
            </div>
        )
    }

    private setMainPerson = () => this.props.infoPerson && this.props.setMainPerson && this.props.setMainPerson(this.props.infoPerson)
}

function mapStateToProps(state: IStoreState) {
  return {
    infoPerson: state.WebsiteReducer.infoPerson,
    mainPerson: state.WebsiteReducer.mainPerson,
    party: state.WebsiteReducer.party,
    userData: state.GoogleReducer.userData,
  };
}

function mapDispatchToProps(dispatch: Dispatch<IStoreState>) {
  return {
    setInfoPerson: bindActionCreators(setInfoPerson, dispatch),
    setMainPerson: bindActionCreators(setMainPerson, dispatch),
    setParty: bindActionCreators(setParty, dispatch),
  };
}

export default connect<{}, {}, IInfoGraphicProps>(mapStateToProps, mapDispatchToProps)(InfoGraphic) as React.ComponentClass<{}>;
