import * as React from "react";
import { connect, Dispatch } from "react-redux";

import {
  Dialog,
  FormGroup,
  Icon,
  InputGroup,
  Intent,
  Tooltip
} from "@blueprintjs/core";

import { DatabaseDispatcher } from "../../Dispatchers/DatabaseDispatcher";
import IStoreState from "../../State/IStoreState";
import { IFrequency, IUser } from "../../Types/Users";
import { showToast } from "../../Utils/Toaster";
import { DialogUtils, handleKeyDown } from "./DialogUtils";

import { FrequencySlider } from "../Common/Sliders/FrequencySlider";
import "./AddNewEvent.scss";
import "./EditUser.scss";

export interface IEditUserDispatchProps {
  dialogUtils: DialogUtils;
  updateFrequency: (frequency: IFrequency) => void;
}

export interface IEditUserStoreProps {
  currentUser: IUser | undefined;
  isPremium: boolean;
  user: Pick<IUser, "claimed" | "gender" | "id" | "location" | "name">;
}

export interface IEditUserProps {
  isOpen: boolean;
  onClose(): void;
}

export interface IFinalPerson {
  gender: string;
  frequency?: number | "IGNORE";
  location: string;
  name: string;
}

export interface IEditUserState {
  finalPerson: IFinalPerson;
  isLoading: boolean;
}

export class PureEditUser extends React.PureComponent<
  IEditUserProps & IEditUserDispatchProps & IEditUserStoreProps,
  IEditUserState
> {
  public state: IEditUserState = {
    finalPerson: {
      gender: this.props.user.gender,
      location: this.props.user.location,
      name: this.props.user.name
    },
    isLoading: false
  };

  public componentDidUpdate(previousProps: IEditUserStoreProps) {
    if (previousProps.user.id !== this.props.user.id) {
      this.setState({
        finalPerson: {
          gender: this.props.user.gender,
          location: this.props.user.location,
          name: this.props.user.name
        }
      });
    }
  }

  public render() {
    return (
      <Dialog
        canEscapeKeyClose={false}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        title={
          <div className="edit-user-title">
            Edit {this.state.finalPerson.name} {this.maybeRenderTooltip()}
          </div>
        }
      >
        <div
          className="edit-user-dialog-body"
          onKeyDown={handleKeyDown(this.handleSubmit, this.props.onClose)}
        >
          <FormGroup className="edit-user-form-group">
            <div className="edit-user-header">Public</div>
            <InputGroup
              className="input-group"
              disabled={this.isDisabled()}
              onChange={this.handleChange("name")}
              placeholder="Full name"
              value={this.state.finalPerson.name}
            />
            <InputGroup
              className="input-group"
              disabled={this.isDisabled()}
              onChange={this.handleChange("gender")}
              placeholder="Gender (M, F or X)"
              value={this.state.finalPerson.gender}
            />
            <InputGroup
              className="input-group"
              disabled={this.isDisabled()}
              onChange={this.handleChange("location")}
              placeholder="Location"
              value={this.state.finalPerson.location}
            />
            {this.maybeRenderPrivateDetails()}
          </FormGroup>
        </div>
        {this.maybeRenderFooterActions()}
      </Dialog>
    );
  }

  private isDisabled = () => {
    const { currentUser } = this.props;
    if (currentUser === undefined) {
      return true;
    }
    return this.props.user.claimed && this.props.user.id !== currentUser.id;
  };

  private maybeRenderTooltip() {
    if (!this.isDisabled()) {
      return null;
    }
    return (
      <>
        <Tooltip content="Looks like this person has claimed their account already.">
          <Icon className="edit-user-tooltip-helper" icon="help" />
        </Tooltip>
      </>
    );
  }

  private maybeRenderPrivateDetails() {
    const { currentUser } = this.props;
    if (!this.props.isPremium || currentUser === undefined) {
      return null;
    }

    const { frequency } = currentUser;
    if (frequency === undefined) {
      return null;
    }

    return (
      <>
        <div className="edit-user-header">Private</div>
        <div className="edit-user-frequency">
          Frequency
          <div className="slider-container">
            <FrequencySlider
              disabled={currentUser.id === this.props.user.id}
              initialValue={frequency[this.props.user.id]}
              onChange={this.handleFrequencyChange}
            />
          </div>
        </div>
      </>
    );
  }

  private handleFrequencyChange = (value: number) => {
    this.adjustFinalPerson("frequency", value);
  };

  private maybeRenderFooterActions() {
    if (this.isDisabled()) {
      return null;
    }
    return this.props.dialogUtils.returnFooterActions(
      this.props.onClose,
      this.handleSubmit
    );
  }

  private handleSubmit = () => {
    if (this.isDisabled()) {
      showToast(
        Intent.DANGER,
        "Cannot update someone who has already claimed their account."
      );
      return;
    }

    const { currentUser } = this.props;
    if (currentUser === undefined) {
      return;
    }

    this.setState({ isLoading: true }, async () => {
      try {
        const { finalPerson } = this.state;
        await this.props.dialogUtils.updateFinalPerson(
          this.props.user,
          finalPerson,
          currentUser.id
        );

        if (this.props.isPremium && finalPerson.frequency !== undefined) {
          await this.props.updateFrequency({
            [this.props.user.id]: finalPerson.frequency
          });
        }

        showToast(
          Intent.SUCCESS,
          `Successfully updated ${this.props.user.name}.`
        );
        this.props.onClose();
      } catch (error) {
        this.setState({ isLoading: false });
      }
    });
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

function mapStoreToProps(state: IStoreState): IEditUserStoreProps {
  return {
    currentUser: state.DatabaseReducer.currentUser,
    isPremium: state.DatabaseReducer.isPremium,
    user: state.WebsiteReducer.infoPerson || {
      claimed: false,
      gender: "",
      id: "",
      location: "",
      name: ""
    }
  };
}

function mapDispatchToProps(dispatch: Dispatch): IEditUserDispatchProps {
  return {
    dialogUtils: new DialogUtils(dispatch),
    updateFrequency: new DatabaseDispatcher(dispatch).updateFrequency
  };
}

export const EditUser = connect(
  mapStoreToProps,
  mapDispatchToProps
)(PureEditUser);
