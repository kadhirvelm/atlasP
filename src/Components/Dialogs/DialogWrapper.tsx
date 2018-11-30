import classNames from "classnames";
import * as React from "react";

import { Button, IconName } from "@blueprintjs/core";

export interface IDialogProps {
  isOpen: boolean;
  onClose(): void;
}

export interface IDialogWrapperProps {
  className?: string;
  containerClassName?: string;
  containerElement?: React.ComponentClass<
    any & {
      className?: string;
      icon: IconName | JSX.Element;
      text?: string;
      onClick(): void;
    }
  >;
  dialog: React.ComponentClass<IDialogProps>;
  dialogProps?: any;
  elementProps?: any;
  icon?: IconName | JSX.Element;
  forceOpen?: boolean;
  text?: string;
}

export interface IDialogWrapperState {
  dialogOpen: boolean;
}

export class DialogWrapper extends React.PureComponent<
  IDialogWrapperProps,
  IDialogWrapperState
> {
  public state: IDialogWrapperState = {
    dialogOpen: this.props.forceOpen || false
  };

  public componentDidUpdate(previousProps: IDialogWrapperProps) {
    if (!previousProps.forceOpen && this.props.forceOpen) {
      this.setState({ dialogOpen: true });
    }
  }

  public render() {
    const Dialog = this.props.dialog;
    if (this.props.children !== undefined) {
      return this.renderChildrenAsTarget(Dialog);
    }
    const Element = this.props.containerElement || Button;
    return (
      <div className={this.props.containerClassName}>
        <Element
          className={classNames(this.props.className)}
          icon={this.props.icon}
          text={this.props.text}
          onClick={this.handleOpenDialog}
          {...this.props.elementProps}
        />
        <Dialog
          isOpen={this.state.dialogOpen}
          onClose={this.handleCloseDialog}
          {...this.props.dialogProps}
        />
      </div>
    );
  }

  private renderChildrenAsTarget(Dialog: React.ComponentClass<IDialogProps>) {
    return (
      <>
        <div onClick={this.handleOpenDialog}>{this.props.children}</div>
        <Dialog
          isOpen={this.state.dialogOpen}
          onClose={this.handleCloseDialog}
          {...this.props.dialogProps}
        />
      </>
    );
  }

  private handleOpenDialog = () => {
    this.setState({ dialogOpen: true });
  };

  private handleCloseDialog = () => {
    this.setState({ dialogOpen: false });
  };
}
