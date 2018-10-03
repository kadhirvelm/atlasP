import * as classNames from "classnames";
import * as React from "react";

import { Button, IconName } from "@blueprintjs/core";

export interface IDialogProps {
    isOpen: boolean;
    onClose(): void;
}

export interface IDialogWrapperProps {
    className?: string;
    containerClassName?: string;
    containerElement?: React.ComponentClass<any & { classNames?: string, icon: IconName, text: string, onClick(): void }>;
    dialog: React.ComponentClass<IDialogProps>;
    dialogProps?: any;
    icon: IconName;
    forceOpen?: boolean;
    text: string;
}

export interface IDialogWrapperState {
    dialogOpen: boolean;
}

export class DialogWrapper extends React.PureComponent<IDialogWrapperProps, IDialogWrapperState> {
    public state: IDialogWrapperState = {
        dialogOpen: this.props.forceOpen || false,
    };

    public render() {
        const Dialog = this.props.dialog;
        const Element = this.props.containerElement || Button;
        return (
            <div className={this.props.containerClassName}>
                <Element
                    className={classNames(this.props.className)}
                    icon={this.props.icon}
                    text={this.props.text}
                    onClick={this.handleOpenDialog}
                />
                <Dialog
                    isOpen={this.state.dialogOpen}
                    onClose={this.handleCloseDialog}
                    {...this.props.dialogProps}
                />
            </div>
        )
    }

    private handleOpenDialog = () => {
        this.setState({ dialogOpen: true });
    }

    private handleCloseDialog = () => {
        this.setState({ dialogOpen: false });
    }
}