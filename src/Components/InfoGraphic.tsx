import * as React from 'react';
import { Dispatch } from 'redux';

import { Button, Intent } from '@blueprintjs/core';

import { calculateScore, IScore } from '../Helpers/GraphHelpers';
import User from '../Helpers/User';
import IStoreState from '../State/IStoreState';

import './InfoGraphic.css';

interface IInfoGraphicProps {
    infoPerson?: User;
    mainPerson: User;
    setMainPerson: (user: User) => (dispatch: Dispatch<IStoreState>) => void;
}

class InfoGraphic extends React.Component<IInfoGraphicProps> {
    public render(){
        return(
            <div className='info-graphic flexbox-column'>
                { this.props.infoPerson && this.renderPerson(this.props.infoPerson) }
            </div>
        )
    }

    private renderPerson(user: User){
        return(
            <div style={ { position: 'relative', flexBasis: '50%', borderBottom: 'solid 1px black', padding: '15px' } } className='flexbox-column'>
                <div key={ user.id } className='show-change'>
                    <div className='flexbox-row' style={ { justifyContent: 'center' } }>
                        <h3> { user.name } ({ user.id }) </h3>
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
        const score: IScore | boolean = (user.id !== this.props.mainPerson.id) && calculateScore(user, this.props.mainPerson)
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
                            <div className='single-column label' style={ { color: 'green' } }>
                                Like
                            </div>
                            <div className='single-column value'>
                                { score.likeScore > 1 ? score.likeScore : '--' }
                            </div>
                        </div>
                        <div className='single-row' style={ { borderBottom: 'dashed 0px black' } }>
                            <div className='single-column label' style={ { color: 'red' } }>
                                Dislike
                            </div>
                            <div className='single-column value'>
                                { score.dislikeScore < 1 ? score.dislikeScore : '--' }
                            </div>
                        </div>
                        <div className='single-row' style={ { borderTop: 'solid 1px black', borderBottom: 'dashed 0px black' } }>
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

    private setMainPerson = () => this.props.infoPerson && this.props.setMainPerson(this.props.infoPerson)
}

export default InfoGraphic