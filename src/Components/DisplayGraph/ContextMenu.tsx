import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Icon } from "@blueprintjs/core";

import { DatabaseDispatcher } from "../../Dispatchers/DatabaseDispatcher";
import IStoreState from "../../State/IStoreState";
import { AddHighlightConnection, RemoveHighlightConnection, SetContextMenuNode } from "../../State/WebsiteActions";
import { IUser } from "../../Types/Users";
import { IGraphUser } from "./DisplayGraph";

import "./ContextMenu.css";

export interface IGraphContextMenuProps {
    onZoomClick(node: IGraphUser): void;
}

export interface IGraphContextMenuStoreProps {
    currentContextNode: IGraphUser | undefined;
    currentUser: IUser | undefined;
    highlightConnections: Set<string>;
}

export interface IGraphContextMenuDispatchProps {
    addHighlight(id: string): void;
    removeHighlight(id: string): void;
    removeFromGraph(id: string): void;
    setContextMenuNode(node: IGraphUser | undefined): void;
}

export interface IGraphContextMenuState {
    screenX: number;
    screenY: number;
}

class PureGraphContextMenu extends React.PureComponent<IGraphContextMenuStoreProps & IGraphContextMenuProps & IGraphContextMenuDispatchProps, IGraphContextMenuState> {
    public state = {
        screenX: 0,
        screenY: 0,
    };
    public ref: HTMLDivElement | null = null;
    public setRef = {
        div: (ref: HTMLDivElement) => this.ref = ref,
    };

    public componentWillMount() {
        window.addEventListener("contextmenu", this.setMouseCoordinates);
        window.addEventListener("click", this.checkForOutsideClick);
    }

    public componentWillUnmount() {
        window.removeEventListener("contextmenu", this.setMouseCoordinates);
        window.removeEventListener("click", this.checkForOutsideClick);
    }

    public render() {
        const { currentContextNode } = this.props;
        if (currentContextNode === undefined) {
            return null;
        }
        return(
            <div className="context-menu-container" ref={this.setRef.div} style={ { top: this.state.screenY, left: this.state.screenX }}>
                <div className="context-menu-node-name">{currentContextNode.name}</div>
                <div className="context-menu-option" onClick={this.handleZoomClick}>
                    <Icon className="context-menu-icon" icon="zoom-in" /> Zoom
                </div>
                {this.renderHighlightConnections(currentContextNode)}
                {this.maybeRenderRemoveConnection(currentContextNode)}
            </div>
        )
    }

    private renderHighlightConnections(currentContextNode: IGraphUser) {
        if (this.props.highlightConnections.has(currentContextNode.id)) {
            return (
                <div className="context-menu-option" onClick={this.handleRemoveHighlight(currentContextNode.id)}>
                    <Icon className="context-menu-icon" icon="delete" /> Remove highlight
                </div>
            )
        }
        return (
            <div className="context-menu-option" onClick={this.handleAddHighlight(currentContextNode.id)}>
                <Icon className="context-menu-icon" icon="highlight" /> Highlight
            </div>
        );
    }

    private maybeRenderRemoveConnection(currentContextNode: IGraphUser) {
        const { currentUser } = this.props;
        if (currentUser === undefined || currentUser.connections === undefined || currentUser.connections[currentContextNode.id].length > 0) {
            return null;
        }
        return (
            <div className="context-menu-option" onClick={this.handleRemoveFromGraph(currentContextNode.id)}>
                <Icon className="context-menu-icon" icon="remove" />Remove
            </div>
        )
    }

    private handleAddHighlight = (id: string) => () => {
        this.props.addHighlight(id);
        this.close();
    }
    private handleRemoveHighlight = (id: string) => () => {
        this.props.removeHighlight(id);
        this.close();
    }

    private handleRemoveFromGraph = (id: string) => () => {
        this.props.removeFromGraph(id);
        this.close();
    }

    private setMouseCoordinates = (event: any) => this.setState({ screenX: event.clientX, screenY: event.clientY });

    private handleZoomClick = () => {
        const { currentContextNode } = this.props;
        if (currentContextNode === undefined) {
            return;
        }
        this.props.onZoomClick(currentContextNode);
        this.close();
    }

    private checkForOutsideClick = (event: any) => {
        if (
            this.ref === null ||
            (this.isInConstraint(event.clientX, this.state.screenX, this.ref.clientWidth) &&
            this.isInConstraint(event.clientY, this.state.screenY, this.ref.clientHeight))
            ) {
            return;
        }
        this.close();
    }

    private isInConstraint(click: number, window: number, size: number) {
        const totalSize = click - window;
        return totalSize > 0 && totalSize < size;
    }

    private close = () => this.props.setContextMenuNode(undefined);
}

function mapStateToProps(state: IStoreState): IGraphContextMenuStoreProps {
    return {
        currentContextNode: state.WebsiteReducer.contextMenuNode,
        currentUser: state.DatabaseReducer.currentUser,
        highlightConnections: state.WebsiteReducer.highlightConnections,
    }
}

function mapDispatchToProps(dispatch: Dispatch): IGraphContextMenuDispatchProps {
    return {
        ...bindActionCreators({
            addHighlight: AddHighlightConnection.create,
            removeHighlight: RemoveHighlightConnection.create,
            setContextMenuNode: SetContextMenuNode.create,
        }, dispatch),
        removeFromGraph: new DatabaseDispatcher(dispatch).removeFromGraph,
    };
}

export const GraphContextMenu = connect(mapStateToProps, mapDispatchToProps)(PureGraphContextMenu);
