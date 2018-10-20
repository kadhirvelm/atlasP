import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Tooltip } from "@blueprintjs/core";

import IStoreState from "../../../../State/IStoreState";
import { ChangeGraphType } from "../../../../State/WebsiteActions";
import { IGraphType } from "../../../../Types/Graph";
import { GRAPHS } from "./GraphConstants";

import "./GraphType.css";

export interface IGraphTypeStoreProps {
    currentGraph: IGraphType;
}

export interface IGraphTypeDispatchProps {
    changeFilter: (newGraph: IGraphType) => void;
}

class PureGraphType extends React.PureComponent<IGraphTypeStoreProps & IGraphTypeDispatchProps> {
    public render() {
        return (
            <div className="graph-type-container">
                {GRAPHS.map(this.renderSingleGraph)}
            </div>
        )
    }

    private renderSingleGraph = (graph: IGraphType, index: number) => {
        return (
            <div className={classNames("graph-type", { "graph-type-selected": this.props.currentGraph.id === graph.id })} key={index} onClick={this.change(graph)}>
                <Tooltip content={graph.tooltip} hoverOpenDelay={1000}>
                    {graph.icon}
                </Tooltip>
            </div>
        )
    }

    private change(graph: IGraphType){
        return () => {
            this.props.changeFilter(graph);
        }
    }
}

function mapStoreToProps(state: IStoreState): IGraphTypeStoreProps {
    return {
        currentGraph: state.WebsiteReducer.graphType,
    }
}

function mapDispatchToProps(dispatch: Dispatch): IGraphTypeDispatchProps {
    return bindActionCreators({ changeFilter: ChangeGraphType.create }, dispatch);
}

export const GraphType = connect(mapStoreToProps, mapDispatchToProps)(PureGraphType);
