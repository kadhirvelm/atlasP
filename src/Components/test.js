var TestComponent = React.createClass({
	getInitialState: function () {
  	return {
      blabla1: false,
      blabla2: false,
      blabla3: false,
      blabla4: false,
      blabla5: false,
      list: ['Box 1', 'Box 2', 'Box 3'],
      dragging: undefined
    }
  },
	toggleSomething: function (stateToToggle) {
  	this.setState({[stateToToggle]: !this.state[stateToToggle]});
  },
  sort: function(list, dragging) {
    const state = this.state;
    state.list = list;
    state.dragging = dragging;
    this.setState({state});
  },
  dragStart: function(ev) {
    this.dragged = Number(ev.currentTarget.dataset.id);
    ev.dataTransfer.effectAllowed = 'move';

    // Firefox requires calling dataTransfer.setData
    // for the drag to properly work
    ev.dataTransfer.setData("text/html", null);
  },
  dragOver: function (ev) {
    ev.preventDefault();
    const items = this.state.list;
    const over = ev.currentTarget
    const dragging = this.state.dragging;
    const from = isFinite(dragging) ? dragging : this.dragged;
    let to = Number(over.dataset.id);

    items.splice(to, 0, items.splice(from,1)[0]);
    this.sort(items, to);
  },
  dragEnd: function(ev) {
    this.sort(this.state.list, undefined);
  },
  render: function() {
    return (
    	<div>
        <ul className="columns">
          {
            this.state.list.map((item, i) => {
              const dragging = (i == this.state.dragging) ? "dragging" : "";
              return <li className={dragging}
                data-id={i}
                key={i}
                onClick={() => this.toggleSomething(item)} 
                draggable="true"
                onDragStart={this.dragStart}
                onDragOver={this.dragOver}
                onDragEnd={this.dragEnd}>
                {item}
              </li>;
            })
          }
        </ul>  
      </div>
    );
  }
});

var MainApp = React.createClass({
  render: function() {
    return (
    	<div>
      	<TestComponent />
      </div>
    );
  }
});

ReactDOM.render(
  <MainApp />,
  document.getElementById('container')
);

