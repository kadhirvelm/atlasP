import * as _ from 'lodash';
import * as React from 'react';

import Event from '../Helpers/Event';
import User from '../Helpers/User';
import './DisplayGraph.css';

interface IDisplayGraphProps {
    readonly userData: { id: User };
    readonly eventData: { id: Event };
}

const MAX_RADIANS = 2 * Math.PI;
const X_ORIGIN = 50;
const Y_ORIGIN = 50;
const RADIUS = 45;

class DisplayGraph extends React.Component<IDisplayGraphProps, any> {
    public state = {
        mainPerson: this.props.userData[1001],
        totalConnections: _.keys(this.props.userData[1001].connections).length,
    }

    private redLines = {}
    private greenLines = {}
    private locations = {}

    public render(){
        const renderRedLines = this.renderSingleLine({ stroke: 'red', strokeWidth: '2' })
        const renderGreenLines = this.renderSingleLine({ stroke: 'green', strokeWidth: '2' })
        return(
            <div className='flexbox-row' style={ { position: 'absolute', flexWrap: 'wrap', width: '100%', height: '100%' } }>
                { this.renderSinglePerson(this.state.mainPerson, { x: X_ORIGIN, y: Y_ORIGIN } ) }
                { _.toPairs(this.state.mainPerson.connections).map((connection, index) => {
                        return this.sendToRenderSinglePerson(parseInt(connection[0], 10), (connection[1] as number[]), index)
                    })
                }
                <svg height='100%' width='100%'>
                    { _.toPairs(this.redLines).map((singleRedLine, index) => renderRedLines(singleRedLine, index)) }
                    { _.toPairs(this.greenLines).map((singleGreenLine, index) => renderGreenLines(singleGreenLine, index)) }
                </svg>
            </div>
        )
    }

    private renderSingleLine(strokeSettings: {}) {
        return (singleLine: [string, {}], index: number) => {
            const location = this.locations[parseInt(singleLine[0], 10)];
            return location ? <line key={ index + strokeSettings['stroke'] } x1='50%' y1='50%' x2={ location.x + '%' } y2={ location.y + '%' } style={ strokeSettings } /> : <div key={ index + strokeSettings['stroke'] } />
        }
    }

    private returnPositionOnCircle(origin: number, mathFunction: (position: number) => number, index: number){
        return origin + (mathFunction(MAX_RADIANS / this.state.totalConnections * index) * RADIUS)
    }

    private sendToRenderSinglePerson(userID: number, connections: number[], index: number){
        return this.renderSinglePerson(this.props.userData[userID], { x: this.returnPositionOnCircle(X_ORIGIN, Math.cos, index), y: this.returnPositionOnCircle(Y_ORIGIN, Math.sin, index) })
    }

    private handleAddingRedAndGreenList(user: User){
        if(user.id !== this.state.mainPerson.id){
            if(user.redList.includes(this.state.mainPerson.id)){ this.redLines[user.id] = Object.assign({}, this.redLines[user.id], { toHost: true }) }
            if(user.greenList.includes(this.state.mainPerson.id)){ this.greenLines[user.id] = Object.assign({}, this.greenLines[user.id], { toHost: true }) }
        } else {
            user.redList.map((singlePerson) => this.redLines[singlePerson] = { fromHost: true })
            user.greenList.map((singlePerson) => this.greenLines[singlePerson] = { fromHost: true })
        }
    }

    private renderSinglePerson(user: User, position: { x: number, y: number }) {
        this.handleAddingRedAndGreenList(user)
        this.locations[user.id] = position
        return(
            <div key={ user.id }>
                <div onClick={ this.changeMainPerson(user) } className={ 'user-node' + ' ' + user.gender } style={ { left: position.x + '%', top: position.y + '%', transform: 'translate(-50%, -50%)' } }>
                    <div className='centered flexbox-column-centered' style={ { color: 'white' } }>
                        <div> { user.name } </div>
                        <div> { user.age } </div>
                    </div>
                </div>
            </div>
        )
    }

    private changeMainPerson(user: User){
        return () => {
            this.redLines = {}
            this.greenLines = {}
            this.setState({ mainPerson: user, totalConnections: _.keys(user.connections).length })
        }
    }
}

export default DisplayGraph
