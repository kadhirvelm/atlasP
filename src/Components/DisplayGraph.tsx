import * as _ from 'lodash';
import * as React from 'react';
import { Dispatch } from 'redux';

import Event from '../Helpers/Event';
import { calculateScore } from '../Helpers/GraphHelpers';
import User from '../Helpers/User';
import IStoreState from '../State/IStoreState';
import './DisplayGraph.css';

interface IDisplayGraphProps {
    readonly userData: { id: User };
    readonly eventData: { id: Event };
    readonly mainPerson?: User;
    setInfoPerson: (user: User) => (dispatch: Dispatch<IStoreState>) => void;
    setMainPerson: (user: User) => (dispatch: Dispatch<IStoreState>) => void;
}

interface ILines {
    id?: {
        fromHost?: boolean,
        toHost?: boolean,
    };
}

interface ILocation {
    id?: {
        x?: number,
        y?: number
    }
}

interface IState {
    greenLines?: ILines;
    locations?: ILocation;
    peopleRender?: JSX.Element;
    redLines?: ILines;
}

const MAX_RADIANS = 2 * Math.PI;
const X_ORIGIN = 50;
const Y_ORIGIN = 50;
const RADIUS = 42;

class DisplayGraph extends React.Component<IDisplayGraphProps, IState> {
    public state: IState
    private totalConnections: number
    private locations: ILocation
    private mainPerson: User
    private redLines: ILines
    private greenLines: ILines
    private dimension: number
    private containerDimensions: HTMLElement | null

    public componentWillMount(){
        this.renderSinglePerson = this.renderSinglePerson.bind(this)
        this.handleAddingRedAndGreenList = this.handleAddingRedAndGreenList.bind(this)
        this.renderSingleLine = this.renderSingleLine.bind(this)
    }

    public componentWillReceiveProps(nextProps: IDisplayGraphProps){
        if(nextProps.mainPerson){
            this.setState(this.returnStateWithPerson(nextProps.mainPerson))
        } else {
            this.props.setMainPerson(nextProps.userData[1001])
        }
    }

    public setRef = (ref: HTMLElement | null ) => {
        this.containerDimensions = ref
        this.setState(this.returnStateWithPerson(this.props.mainPerson || this.props.userData[1001]))
    }

    public render(){
        const renderRedLines = this.renderSingleLine({ stroke: 'red', fill: 'red', strokeWidth: '2' })
        const renderGreenLines = this.renderSingleLine({ stroke: 'green', fill: 'green', strokeWidth: '2' })
        return(
            <div id='Graph Container' ref={ this.setRef } className='flexbox-row' style={ { position: 'relative', width: '100%', height: '100%' } }>
                { this.state &&
                    <div>
                        { this.state.peopleRender }
                        <svg height={ this.containerDimensions ? this.containerDimensions.clientHeight : '100%' } width={ this.containerDimensions ? this.containerDimensions.clientWidth : '100%' }>
                            { _.toPairs(this.state.redLines).map((singleRedLine, index) => renderRedLines(singleRedLine, index)) }
                            { _.toPairs(this.state.greenLines).map((singleGreenLine, index) => renderGreenLines(singleGreenLine, index)) }
                        </svg>
                    </div>
                }
            </div>
        )
    }

    private convertToAbsolutePoint(left: number, top: number){
        return this.containerDimensions ? { x: (this.containerDimensions.clientWidth * left / 100), y: (this.containerDimensions.clientHeight * top / 100) } : 0
    }

    private renderMovingCircleAndLine(index: string, strokeSettings: object, x: object, y: object){
        return (
            <svg>
                <circle id={ 'circle' + index } r='3' { ...strokeSettings }>
                    <animate xlinkHref={ '#circle' + index } attributeName='cx' from={ x['from'] } to={ x['to'] } dur='5s' repeatCount='indefinite' d='cirx-anim' />
                    <animate xlinkHref={ '#circle' + index } attributeName='cy' from={ y['from'] } to={ y['to'] } dur='5s' repeatCount='indefinite' d='ciry-anim' />
                </circle>
                <circle id={ 'circle2' + index } r='3' { ...strokeSettings }>
                    <animate xlinkHref={ '#circle2' + index } attributeName='cx' from={ x['from'] } to={ x['to'] } dur='5s' repeatCount='indefinite' begin='2.5s' />
                    <animate xlinkHref={ '#circle2' + index } attributeName='cy' from={ y['from'] } to={ y['to'] } dur='5s' repeatCount='indefinite' begin='2.5s' />
                </circle>
            </svg>
        )
    }

    private renderSingleLine(strokeSettings: {}) {
        return (singleLine: [string, {}], index: number) => {
            const location = this.state.locations && this.state.locations[parseInt(singleLine[0], 10)];
            if(location){
                const circleSettings = { index: index + strokeSettings['stroke'], positions: this.convertToAbsolutePoint(location.x, location.y), origin: this.convertToAbsolutePoint(X_ORIGIN, Y_ORIGIN) }
                return(
                    <svg key={ index + strokeSettings['stroke'] }>
                        { singleLine[1]['fromHost'] && this.renderMovingCircleAndLine(circleSettings.index + '_from', strokeSettings, { to: circleSettings.positions['x'], from: circleSettings.origin['x'] }, { to: circleSettings.positions['y'], from: circleSettings.origin['y'] }) }
                        { singleLine[1]['toHost'] && this.renderMovingCircleAndLine(circleSettings.index + '_to', strokeSettings, { from: circleSettings.positions['x'], to: circleSettings.origin['x'] }, { from: circleSettings.positions['y'], to: circleSettings.origin['y'] }) }
                        <path d={ 'M' + circleSettings.positions['x'] + ' ' + circleSettings.positions['y'] + ' L' + circleSettings.origin['x'] + ' ' + circleSettings.origin['y'] } style={ { opacity: (singleLine[1]['fromHost'] && singleLine[1]['toHost']) ? 1 : 0.15 } } { ...strokeSettings } />
                    </svg>
                )
            }
            return <div key={ index + strokeSettings['stroke'] } />       
        }
    }

    private returnPositionOnCircle(origin: number, mathFunction: (position: number) => number, index: number){
        return origin + (mathFunction(MAX_RADIANS / this.totalConnections * index) * RADIUS)
    }

    private sendToRenderSinglePerson(userID: number, connections: number[], index: number){
        return this.renderSinglePerson(this.props.userData[userID], { x: this.returnPositionOnCircle(X_ORIGIN, Math.cos, index), y: this.returnPositionOnCircle(Y_ORIGIN, Math.sin, index) })
    }

    private handleAddingRedAndGreenList(user: User){
        if(user.id !== this.mainPerson.id){
            if(user.redList.includes(this.mainPerson.id)){ this.redLines[user.id] = Object.assign({}, this.redLines[user.id], { toHost: true }) }
            if(user.greenList.includes(this.mainPerson.id)){ this.greenLines[user.id] = Object.assign({}, this.greenLines[user.id], { toHost: true }) }
        } else {
            user.redList.map((singlePerson) => this.redLines[singlePerson] = { fromHost: true })
            user.greenList.map((singlePerson) => this.greenLines[singlePerson] = { fromHost: true })
        }
    }

    private renderSinglePerson(user: User, position: { x: number, y: number }){
        this.handleAddingRedAndGreenList(user)
        this.locations[user.id] = position
        const scoreTally = (user.id !== this.mainPerson.id ? calculateScore(user, this.mainPerson) : { isHost: true })
        return(
            <div key={ user.id }> 
                <div onClick={ this.changeInfoPerson(user) } className={ 'user-node' + ' ' + user.gender } style={ { width: this.dimension + 'vmin', height: this.dimension + 'vmin', left: position.x + '%', top: position.y + '%', transform: 'translate(-50%, -50%)' } }>
                    <div className='centered flexbox-column-centered' style={ { color: 'white' } }>
                        <div> { user.name } </div>
                        <div> { scoreTally.isHost ? 'Host' : scoreTally['finalScore'] } </div>
                    </div>
                </div>
            </div>
        )
    }
    
    private assemblePeople(mainPerson: User): JSX.Element {
        return(
            <div>
                { this.renderSinglePerson(mainPerson, { x: X_ORIGIN, y: Y_ORIGIN } ) }
                { _.toPairs(mainPerson.connections).map((connection, index) => this.sendToRenderSinglePerson(parseInt(connection[0], 10), (connection[1] as number[]), index)) }
            </div>
        )
    }

    private returnStateWithPerson(user: User){
        if(this.containerDimensions){
            this.totalConnections = _.keys(user.connections).length
            this.redLines = {}
            this.greenLines = {}
            this.locations = {}
            this.mainPerson = user
            this.dimension = (-(this.totalConnections) / 2.8) + 19
            const peopleRender = this.assemblePeople(user)
            return { mainPerson: user, peopleRender, locations: this.locations, redLines: this.redLines, greenLines: this.greenLines }
        }
        return {}
    }

    private changeInfoPerson(user: User){
        return () => {
            this.props.setInfoPerson(user)
        }
    }
}

export default DisplayGraph
