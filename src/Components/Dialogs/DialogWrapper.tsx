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
    dialog: React.ComponentClass<IDialogProps>;
    icon: IconName;
    text: string;
}

export interface IDialogWrapperState {
    dialogOpen: boolean;
}

export class DialogWrapper extends React.PureComponent<IDialogWrapperProps, IDialogWrapperState> {
    public state: IDialogWrapperState = {
        dialogOpen: false,
    };

    public render() {
        const Dialog = this.props.dialog;
        return (
            <div className={this.props.containerClassName}>
                <Button
                    className={classNames(this.props.className)}
                    icon={this.props.icon}
                    text={this.props.text}
                    onClick={this.handleOpenDialog}
                />
                <Dialog
                    isOpen={this.state.dialogOpen}
                    onClose={this.handleCloseDialog}
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