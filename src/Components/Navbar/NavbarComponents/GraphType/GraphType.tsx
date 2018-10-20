import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Button } from "@blueprintjs/core";

import IStoreState from "../../../../State/IStoreState";
import { ChangeGraphType } from "../../../../State/WebsiteActions";
import { IGraphType } from "../../../../Types/Graph";
import { DRIFT_GRAPH, ONE_ON_ONE_GRAPH } from "./GraphConstants";

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
                <Button text="One-on-One" onClick={this.change(ONE_ON_ONE_GRAPH) } />
                <Button text="Drift" onClick={this.change(DRIFT_GRAPH) } />
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
