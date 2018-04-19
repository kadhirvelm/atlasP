import * as React from 'react';
import { Dispatch } from 'redux';

import { Button, Classes, Dialog, EditableText, Intent } from '@blueprintjs/core';
import User from '../Helpers/User'
import IStoreState from '../State/IStoreState'

interface IFetchPersonProps {
    handleMainPersonDialogClose: () => void;
    readonly mainPerson?: User;
    readonly mainPersonDialogOpen: boolean;
    readonly userData?: { id: User };
    setMainPerson: (user: User) => (dispatch: Dispatch<IStoreState>) => void;
}

interface IFetchPersonState {
    id: string;
}

class FetchPerson extends React.Component<IFetchPersonProps, IFetchPersonState> {
    public state = {
        id: ''
    }

    public render(){
        return(
            <Dialog icon='inbox' isOpen={ this.props.mainPersonDialogOpen } onClose={ this.props.handleMainPersonDialogClose } title='Fetch Specific Person'>
                <div className={ Classes.DIALOG_BODY }>
                    { this.props.mainPerson ? this.renderCurrentPerson(this.props.mainPerson) : 'Unknown' }
                    <div className='flexbox-row' style={ { flexGrow: 1, justifyContent: 'center', alignItems: 'baseline' } }>
                        <div className='flexbox-row' style={ { flexBasis: '50%', justifyContent: 'flex-end' } }>
                            <h2 style={ { marginTop: '25px' } }>
                                <EditableText
                                intent={ Intent.PRIMARY }
                                maxLength={ 4 }
                                placeholder='Enter ID'
                                value={ this.state.id }
                                onChange={ this.changeValue } />
                            </h2>
                        </div>
                        <div className='flexbox-row' style={ { flexBasis: '50%', justifyContent: 'flex-start' } }>
                            <h3 style={ { marginLeft: '15px', color: '#1D8348' } }>
                                { (this.state.id && this.props.userData && this.props.userData[this.state.id]) ? this.props.userData[this.state.id].name : '' }
                            </h3>
                        </div>
                    </div>
                </div>
                <div className={ Classes.DIALOG_FOOTER }>
                    <div className={ Classes.DIALOG_FOOTER_ACTIONS }>
                    <Button text='Cancel' onClick={ this.props.handleMainPersonDialogClose } />
                    <Button onClick={ this.changeMainPerson } intent={ Intent.PRIMARY } text='Select' disabled={ (this.props.userData && this.props.userData[this.state.id]) ? false : true } />
                    </div>
                </div>
            </Dialog>
        )
    }

    private changeValue = (value: string) => this.setState({ id: value })
    private changeMainPerson = () => {
        if(this.props.userData){
            this.props.setMainPerson(this.props.userData[this.state.id])
            this.props.handleMainPersonDialogClose()
            this.setState({ id: '' })
        }
    }
    private renderCurrentPerson(user: User){
        return(
            <div>
                Current: <b> { user.name } - { user.id } </b>
            </div>
        )
    }
}

export default FetchPerson