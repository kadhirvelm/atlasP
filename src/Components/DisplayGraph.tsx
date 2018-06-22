import * as React from 'react';
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from 'redux';

import User from '../Helpers/User';
import './DisplayGraph.css';
import { SetInfoPerson, SetMainPerson, SetGraphRef } from '../State/WebsiteActions';
import IStoreState from '../State/IStoreState';
import { selectMainPersonGraph, IPeopleGraph } from '../Helpers/selectors';


export interface IDisplayGraphStateProps {
    graphRef: HTMLElement | null;
    peopleGraph: IPeopleGraph,
}

export interface IDisplayGraphDispatchProps {
    setInfoPerson(infoPerson: User): void;
    setGraphRef(ref: HTMLElement | null): void;
    setMainPerson(mainPerson: User): void;
}

class PureDispayGraph extends React.Component<IDisplayGraphStateProps & IDisplayGraphDispatchProps> {

    // public componentWillMount(){
    //     this.renderSingleLine = this.renderSingleLine.bind(this);
    // }

    // public componentWillReceiveProps(nextProps: IDisplayGraphStateProps){
    //     if (nextProps.userData !== undefined && nextProps.mainPerson === undefined) {
    //         const randomUser = _.sample(nextProps.userData);
    //         if (randomUser !== undefined) {
    //             this.props.setMainPerson(randomUser);
    //         }
    //     }
    // }

    public setRef = (ref: HTMLElement | null ) => {
        if (this.props.graphRef == null) {
            this.props.setGraphRef(ref);
        }
    }

    public render(){
        // const renderRedLines = this.renderSingleLine({ stroke: 'red', fill: 'red', strokeWidth: '2' });
        // const renderGreenLines = this.renderSingleLine({ stroke: 'green', fill: 'green', strokeWidth: '2' });
        console.log(this.props.peopleGraph);
        return(
            <div id='Graph Container' ref={this.setRef} className='flexbox-row' style={{ position: 'relative', width: '100%', height: '100%' }}>
                Reaching
            </div>
        )
    }

    // <svg height={this.containerDimensions ? this.containerDimensions.clientHeight : '100%'} width={this.containerDimensions ? this.containerDimensions.clientWidth : '100%'}>
    //     {_.toPairs(this.state.redLines).map((singleRedLine, index) => renderRedLines(singleRedLine, index))}
    //     {_.toPairs(this.state.greenLines).map((singleGreenLine, index) => renderGreenLines(singleGreenLine, index))}
    // </svg>

    // private convertToAbsolutePoint(left: number, top: number){
    //     return this.containerDimensions ? { x: (this.containerDimensions.clientWidth * left / 100), y: (this.containerDimensions.clientHeight * top / 100) } : 0
    // }

    // private renderMovingCircleAndLine(index: string, strokeSettings: object, x: object, y: object){
    //     return (
    //         <svg>
    //             <circle id={'circle' + index} r='3' {...strokeSettings}>
    //                 <animate xlinkHref={'#circle' + index} attributeName='cx' from={x['from']} to={x['to']} dur='5s' repeatCount='indefinite' d='cirx-anim' />
    //                 <animate xlinkHref={'#circle' + index} attributeName='cy' from={y['from']} to={y['to']} dur='5s' repeatCount='indefinite' d='ciry-anim' />
    //             </circle>
    //             <circle id={'circle2' + index} r='3' {...strokeSettings}>
    //                 <animate xlinkHref={'#circle2' + index} attributeName='cx' from={x['from']} to={x['to']} dur='5s' repeatCount='indefinite' begin='2.5s' />
    //                 <animate xlinkHref={'#circle2' + index} attributeName='cy' from={y['from']} to={y['to']} dur='5s' repeatCount='indefinite' begin='2.5s' />
    //             </circle>
    //         </svg>
    //     )
    // }

    // private renderSingleLine(strokeSettings: {}) {
    //     return (singleLine: [string, {}], index: number) => {
    //         const location = this.state.locations && this.state.locations[parseInt(singleLine[0], 10)];
    //         if(location){
    //             const circleSettings = { index: index + strokeSettings['stroke'], positions: this.convertToAbsolutePoint(location.x, location.y), origin: this.convertToAbsolutePoint(X_ORIGIN, Y_ORIGIN) }
    //             return(
    //                 <svg key={index + strokeSettings['stroke']}>
    //                     {singleLine[1]['fromHost'] && this.renderMovingCircleAndLine(circleSettings.index + '_from', strokeSettings, { to: circleSettings.positions['x'], from: circleSettings.origin['x'] }, { to: circleSettings.positions['y'], from: circleSettings.origin['y'] })}
    //                     {singleLine[1]['toHost'] && this.renderMovingCircleAndLine(circleSettings.index + '_to', strokeSettings, { from: circleSettings.positions['x'], to: circleSettings.origin['x'] }, { from: circleSettings.positions['y'], to: circleSettings.origin['y'] })}
    //                     <path d={'M' + circleSettings.positions['x'] + ' ' + circleSettings.positions['y'] + ' L' + circleSettings.origin['x'] + ' ' + circleSettings.origin['y']} style={{ opacity: (singleLine[1]['fromHost'] && singleLine[1]['toHost']) ? 1 : 0.15 }} {...strokeSettings} />
    //                 </svg>
    //             )
    //         }
    //         return <div key={index + strokeSettings['stroke']} />       
    //     }
    // }
}

function mapStateToProps(state: IStoreState): IDisplayGraphStateProps {
    return {
        graphRef: state.WebsiteReducer.graphRef,
        peopleGraph: selectMainPersonGraph(state),
    }
}

function mapDispatchToProps(dispatch: Dispatch): IDisplayGraphDispatchProps {
    return bindActionCreators({
        setGraphRef: SetGraphRef.create,
        setInfoPerson: SetInfoPerson.create,
        setMainPerson: SetMainPerson.create,
    }, dispatch)
}

export const DisplayGraph = connect(mapStateToProps, mapDispatchToProps)(PureDispayGraph);
