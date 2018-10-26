import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Icon } from "@blueprintjs/core";

import IStoreState from "../../State/IStoreState";
import { SetContextMenuNode } from "../../State/WebsiteActions";
import { IGraphUser } from "./DisplayGraph";

import "./ContextMenu.css";

export interface IGraphContextMenuProps {
    onZoomClick(node: IGraphUser): void;
}

export interface IGraphContextMenuStoreProps {
    currentContextNode: IGraphUser | undefined;
}

export interface IGraphContextMenuDispatchProps {
    setContextMenuNode: (node: IGraphUser | undefined) => void;
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
            </div>
        )
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
    }
}

function mapDispatchToProps(dispatch: Dispatch): IGraphContextMenuDispatchProps {
    return bindActionCreators({
        setContextMenuNode: SetContextMenuNode.create,
    }, dispatch);
}

export const GraphContextMenu = connect(mapStateToProps, mapDispatchToProps)(PureGraphContextMenu);
