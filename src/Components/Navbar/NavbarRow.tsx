import classNames from "classnames";
import * as React from "react";
import "./NavbarRow.css";

export interface INavbarRowProps {
    className?: string;
    componentHeight?: number;
    isHovering: boolean;
    icon: JSX.Element,
    text: string,
    handleHoverLeave(): void;
    onClick?(): void
};

export interface INavbarRowState {
    isOpen: boolean;
}

const HEADER_HEIGHT = 50;

export class NavbarRow extends React.PureComponent<INavbarRowProps, INavbarRowState> {
    public state = {
        isOpen: false,
    };

    public render() {
        return (
            <div className={classNames(this.props.className, "navbar-button-component")} style={{height: this.getHeight() }}>
                <div className="navbar-button-header" onClick={this.handleOnClick}>
                    {this.props.icon}
                    {this.maybeRenderText()}
                </div>
                {this.maybeRenderChildren()}
            </div>
        );
    }

    private maybeRenderText() {
        if (!this.props.isHovering) {
            return null;
        }

        return (
            <div className="navbar-button-text" onClick={this.props.onClick}>
                {this.props.text}
            </div>
        );
    }

    private maybeRenderChildren() {
        if (!this.props.isHovering || !this.state.isOpen) {
            return null;
        }
        return <div className="navbar-children">{this.props.children}</div>;
    }

    private handleOnClick = () => {
        if (this.props.children !== undefined) {
            this.setState({ isOpen: !this.state.isOpen });
            return;
        }

        // HACKHACK: need to remove this once the events expand within the navbar
        this.props.handleHoverLeave();
        if (this.props.onClick === undefined) {
            return;
        }
        this.props.onClick();
    }

    private getHeight() {
        const { componentHeight } = this.props;
        if (componentHeight === undefined || !this.props.isHovering || !this.state.isOpen) {
            return HEADER_HEIGHT + "px";
        }
        return componentHeight + HEADER_HEIGHT + "px";
    }
}
