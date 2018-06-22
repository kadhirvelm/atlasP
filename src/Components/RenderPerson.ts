// import { calculateScore } from '../Helpers/GraphHelpers';

// handleDragStart(event: any){
//     event.dataTransfer.setData('text', event.currentTarget.id)
//     const img = document.createElement('img')
//     img.src = 'https://d30y9cdsu7xlg0.cloudfront.net/png/5024-200.png'
//     event.dataTransfer.setDragImage(img, 50, 150)
// }

// const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24

// calcuateTimeDifferenceInDays(time: string){
//     const timeDiff = (new Date().getTime() - new Date(time).getTime()) / (MILLISECONDS_IN_DAY)
//     if(timeDiff < 14){
//         return 'G'
//     } else if (timeDiff < 28){
//         return 'Y'
//     }
//     return 'R'
// }

// maybeRenderSinglePerson(user: User, position: { x: number, y: number }){
//     if (this.props.eventData === undefined) {
//         return null;
//     }
//     this.locations[user.id] = position
//     const scoreTally = (this.props.mainPerson !== undefined && user.id !== this.props.mainPerson.id ? calculateScore(user, this.props.mainPerson) : { isMain: true })
//     return(
//         <div key={user.id} style={{ position: 'absolute', left: position.x + '%', top: position.y + '%', transform: 'translate(-50%, -50%)' }}>
//             <div className={'user-node time-difference ' + this.calcuateTimeDifferenceInDays(this.props.eventData[user.events.slice(-1)[0]].date)} style={{ width: this.dimension + 1 + 'vmin', height: this.dimension + 1 + 'vmin' }} />
//             <div id={user.gender + '_' + user.id} className={'user-node' + ' ' + user.gender} draggable={true} onDragStart={this.handleDragStart} onDoubleClick={this.changeMainPerson(user)} onClick={this.changeInfoPerson(user)} style={{ width: this.dimension + 'vmin', height: this.dimension + 'vmin' }}>
//                 <div className='centered flexbox-column-centered' style={{ color: 'white' }}>
//                     <div> {user.name} </div>
//                     <div> {scoreTally.isMain ? 'Main' : scoreTally['finalScore']} </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// returnPositionOnCircle(origin: number, mathFunction: (position: number) => number, index: number){
//     return origin + (mathFunction(MAX_RADIANS / this.totalConnections * index) * RADIUS)
// }

// sendToRenderSinglePerson(userID: number, index: number){
//     if (this.props.userData === undefined) {
//         return null;
//     }
//     return this.maybeRenderSinglePerson(this.props.userData[userID], { x: this.returnPositionOnCircle(X_ORIGIN, Math.cos, index), y: this.returnPositionOnCircle(Y_ORIGIN, Math.sin, index) })
// }

// assemblePeople(mainPerson: User): JSX.Element {
//     return(
//         <div>
//             {this.maybeRenderSinglePerson(mainPerson, { x: X_ORIGIN, y: Y_ORIGIN } )}
//             {_.toPairs(mainPerson.connections).map((connection, index) => this.sendToRenderSinglePerson(parseInt(connection[0], 10), index))}
//         </div>
//     )
// }


// returnStateWithPerson(user: User): IDisplayGraphState{
//     if(this.containerDimensions && _.keys(this.props.userData).length){
//         this.totalConnections = _.keys(user.connections).length
//         this.redLines = {}
//         this.greenLines = {}
//         this.locations = {}
//         this.dimension = (-(this.totalConnections) / 2.25) + 19
//         const peopleRender = this.assemblePeople(user)
//         return { peopleRender, locations: this.locations, redLines: this.redLines, greenLines: this.greenLines }
//     }
//     return {}
// }