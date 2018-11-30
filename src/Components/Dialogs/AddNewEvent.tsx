import classNames from "classnames";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

import {
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  Intent
} from "@blueprintjs/core";

import IStoreState from "../../State/IStoreState";
import { IUser } from "../../Types/Users";
import { showToast } from "../../Utils/Toaster";
import { Autocomplete, IAutcompleteValuesProps } from "../Common/Autocomplete";
import { DialogUtils } from "./DialogUtils";
import { IDialogProps } from "./DialogWrapper";

import "./AddNewEvent.scss";

export interface IAddNewEventStateProps {
  additionalUsers?: IUser[] | undefined;
  currentUser: IUser | undefined;
  users: Map<string, IUser> | undefined;
}

export interface IAddNewEventDispatchProps {
  dialogUtils: DialogUtils;
}

export interface ITemporaryEvent {
  attendees: IUser[];
  date: string;
  description: string;
}

export interface IAddNewEventState {
  temporaryEvent: ITemporaryEvent;
  isSubmitting: boolean;
}

export class PureAddNewEvent extends React.PureComponent<
  IDialogProps & IAddNewEventStateProps & IAddNewEventDispatchProps,
  IAddNewEventState
> {
  public EMPTY_STATE: IAddNewEventState = {
    isSubmitting: false,
    temporaryEvent: {
      attendees:
        this.props.currentUser === undefined ? [] : [this.props.currentUser],
      date: new Date().toLocaleDateString(),
      description: ""
    }
  };
  public state: IAddNewEventState = this.EMPTY_STATE;

  public componentDidUpdate(previousProps: IAddNewEventStateProps) {
    if (previousProps.additionalUsers !== this.props.additionalUsers) {
      this.updateAttendeesFromProps();
    }
  }

  public render() {
    return (
      <Dialog
        canEscapeKeyClose={false}
        canOutsideClickClose={false}
        isOpen={this.props.isOpen}
        onClose={this.resetStateAndClose}
        title="Add New Event"
      >
        <div className={Classes.DIALOG_BODY}>
          <FormGroup>
            <InputGroup
              autoFocus={true}
              className="input-group"
              onChange={this.handleChange("description")}
              placeholder="Description"
              value={this.state.temporaryEvent.description}
            />
            <Autocomplete
              className={classNames("input-group", "autocomplete-attendees")}
              dataSource={this.props.users}
              displayKey="name"
              multiselection={true}
              placeholderText="Search for users…"
              values={this.getAttendees()}
              onSelection={this.props.dialogUtils.handleAttendeeSelection(
                this.state.temporaryEvent,
                this.adjustFinalEvent
              )}
            />
            <InputGroup
              className="input-group"
              onChange={this.handleChange("date")}
              placeholder={`Date, eg. ${new Date().toLocaleDateString()}`}
              value={this.state.temporaryEvent.date}
            />
          </FormGroup>
        </div>
        {this.props.dialogUtils.returnFooterActions(
          this.props.onClose,
          this.handleSubmit,
          this.state.isSubmitting
        )}
      </Dialog>
    );
  }

  private updateAttendeesFromProps = () => {
    const { additionalUsers, users } = this.props;
    if (additionalUsers === undefined || users === undefined) {
      return;
    }
    const finalUsers = additionalUsers
      .map(user => users.get(user.id))
      .filter(user => user !== undefined);
    this.adjustFinalEvent(
      "attendees",
      (finalUsers as IUser[]).concat(this.state.temporaryEvent.attendees)
    );
  };

  private resetStateAndClose = () => {
    this.setState(this.EMPTY_STATE, () => {
      this.props.onClose();
    });
  };

  private handleSubmit = () => {
    this.setState({ isSubmitting: true }, async () => {
      try {
        await this.props.dialogUtils.submitFinalEvent(
          this.state.temporaryEvent
        );
        showToast(
          Intent.SUCCESS,
          `Successfully added ${this.state.temporaryEvent.description}.`
        );
        this.resetStateAndClose();
      } catch (error) {
        this.setState({ isSubmitting: false });
      }
    });
  };

  private getAttendees = () => {
    return this.state.temporaryEvent.attendees
      .map((user: IUser) => {
        return { [user.id]: user.name };
      })
      .reduce((a: IAutcompleteValuesProps, b: IAutcompleteValuesProps) => {
        return { ...b, ...a };
      }, {});
  };

  private handleChange = (key: keyof ITemporaryEvent) => {
    return (event: React.FormEvent<HTMLElement>) => {
      this.adjustFinalEvent(key, (event.target as any).value);
    };
  };

  private adjustFinalEvent = (key: keyof ITemporaryEvent, newValue: any) => {
    this.setState({
      temporaryEvent: { ...this.state.temporaryEvent, [key]: newValue }
    });
  };
}

function mapStateToProps(state: IStoreState): IAddNewEventStateProps {
  return {
    additionalUsers: state.WebsiteReducer.additionalPeopleToEvent,
    currentUser: state.DatabaseReducer.currentUser,
    users: state.DatabaseReducer.userData
  };
}

function mapDispatchToProps(dispatch: Dispatch): IAddNewEventDispatchProps {
  return {
    dialogUtils: new DialogUtils(dispatch)
  };
}

export const AddNewEvent = connect(
  mapStateToProps,
  mapDispatchToProps
)(PureAddNewEvent);
