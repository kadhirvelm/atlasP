import classNames from "classnames";
import * as React from "react";

import "./NavbarRow.css";

export interface INavbarRowProps {
    className?: string;
    hovering: boolean;
    icon: JSX.Element,
    text: string,
    handleHoverLeave(): void;
    onClick?(): void
};

export class NavbarRow extends React.Component<INavbarRowProps> {
    public render() {
        return (
            <div className={classNames(this.props.className, "navbar-button-component")} onClick={this.handleOnClick}>
                {this.props.icon}
                {this.props.hovering &&
                    <div className="navbar-hovered-component" onClick={this.props.onClick}>
                        {this.props.text}
                    </div>
                }
            </div>
        )
    }

    private handleOnClick = () => {
        // HACKHACK: need to remove this once the events expand within the navbar
        this.props.handleHoverLeave();
        if (this.props.onClick === undefined) {
            return;
        }
        this.props.onClick();
    }
}
