import * as React from "react";
import { connect, Dispatch } from "react-redux";

import {
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  Intent
} from "@blueprintjs/core";

import { showToast } from "../../Utils/Toaster";
import { DialogUtils } from "./DialogUtils";

import "./AddNewEvent.scss";

export interface IAddNewPersonDispatchProps {
  dialogUtils: DialogUtils;
}

interface IAddNewPersonProps {
  isOpen: boolean;
  onClose(): void;
}

export interface IFinalPerson {
  name: string;
  gender: string;
  location: string;
}

export interface IAddNewPersonState {
  finalPerson: IFinalPerson;
  isLoading: boolean;
}

const EMPTY_STATE: IAddNewPersonState = {
  finalPerson: {
    gender: "X",
    location: "",
    name: ""
  },
  isLoading: false
};

export class PureAddNewPerson extends React.PureComponent<
  IAddNewPersonProps & IAddNewPersonDispatchProps,
  IAddNewPersonState
> {
  public state: IAddNewPersonState = EMPTY_STATE;

  public render() {
    return (
      <Dialog
        canEscapeKeyClose={false}
        isOpen={this.props.isOpen}
        onClose={this.resetStateAndClose}
        title="Add New Person"
      >
        <div className={Classes.DIALOG_BODY}>
          <FormGroup>
            <InputGroup
              className="input-group"
              onChange={this.handleChange("name")}
              placeholder="Full name"
            />
            <InputGroup
              className="input-group"
              onChange={this.handleChange("gender")}
              placeholder="Gender (M, F or X)"
            />
            <InputGroup
              className="input-group"
              onChange={this.handleChange("location")}
              placeholder="Location"
            />
          </FormGroup>
        </div>
        {this.props.dialogUtils.returnFooterActions(
          this.props.onClose,
          this.handleSubmit
        )}
      </Dialog>
    );
  }

  private resetStateAndClose = () => {
    this.setState(EMPTY_STATE, () => {
      this.props.onClose();
    });
  };

  private handleSubmit = () => {
    try {
      this.setState({ isLoading: true }, async () => {
        const { finalPerson } = this.state;
        await this.props.dialogUtils.submitFinalPerson(finalPerson);
        showToast(Intent.SUCCESS, "Successfully created new user.");
        this.resetStateAndClose();
      });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  };

  private handleChange = (key: string) => {
    return (event: React.FormEvent<HTMLElement>) => {
      this.adjustFinalPerson(key, (event.target as any).value);
    };
  };

  private adjustFinalPerson = (key: string, newValue: any) => {
    this.setState({
      finalPerson: { ...this.state.finalPerson, [key]: newValue }
    });
  };
}

function mapDispatchToProps(dispatch: Dispatch): IAddNewPersonDispatchProps {
  return {
    dialogUtils: new DialogUtils(dispatch)
  };
}

export const AddNewPerson = connect(
  undefined,
  mapDispatchToProps
)(PureAddNewPerson);
