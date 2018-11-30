import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { CompoundAction } from "redoodle";

import { Button, Dialog } from "@blueprintjs/core";

import { DatabaseDispatcher } from "../../Dispatchers/DatabaseDispatcher";
import IStoreState from "../../State/IStoreState";
import {
  AddPeopleToEvent,
  DisplayRecommendation,
  OpenNavbarDialog
} from "../../State/WebsiteActions";
import { IUser } from "../../Types/Users";
import { getFirstName } from "../../Utils/User";

import "./Recommendation.scss";

export interface IRecommendationStoreProps {
  currentUser: IUser | undefined;
  displayRecommendation: IUser | undefined;
}

export interface IRecommendationDispatchProps {
  addToEvent(addUser: IUser): void;
  dismissRecommendationPopover(): void;
  writeHasSeenDisplayRecommendation(): void;
}

class PureRecommendation extends React.PureComponent<
  IRecommendationStoreProps & IRecommendationDispatchProps
> {
  public render() {
    const { currentUser, displayRecommendation } = this.props;
    if (displayRecommendation === undefined || currentUser === undefined) {
      return null;
    }
    return (
      <Dialog
        canEscapeKeyClose={false}
        canOutsideClickClose={false}
        icon="person"
        isOpen={true}
        title="Weekly Recommendation"
      >
        <div className="recommendation">
          Hi {getFirstName(currentUser.name)}, we thought you should see{" "}
          <strong>{displayRecommendation.name}</strong> this week. How are you
          feeling about that?
        </div>
        <div className="recommendation-actions-container">
          {this.renderIgnoreButton()}
          {this.renderCloseButton()}
          {this.renderInAnEvent()}
        </div>
      </Dialog>
    );
  }

  private renderIgnoreButton() {
    return (
      <Button
        className="recommendation-action"
        intent="danger"
        text="Would rather not."
        onClick={this.handleCompleteDisplayDialog}
      />
    );
  }

  private renderCloseButton() {
    return (
      <Button
        className="recommendation-action"
        text="Remind me later"
        onClick={this.props.dismissRecommendationPopover}
      />
    );
  }

  private renderInAnEvent() {
    return (
      <Button
        className="recommendation-action"
        intent="primary"
        text="I'm seeing them soon!"
        onClick={this.handleInAnEvent}
      />
    );
  }

  private handleInAnEvent = () => {
    const { displayRecommendation } = this.props;
    if (displayRecommendation === undefined) {
      return;
    }

    this.props.addToEvent(displayRecommendation);
    this.handleCompleteDisplayDialog();
  };

  private handleCompleteDisplayDialog = () => {
    this.props.writeHasSeenDisplayRecommendation();
    this.props.dismissRecommendationPopover();
  };
}

function mapStoreToProps(store: IStoreState): IRecommendationStoreProps {
  return {
    currentUser: store.DatabaseReducer.currentUser,
    displayRecommendation: store.WebsiteReducer.displayRecommendation
  };
}

function mapDispatchToProps(dispatch: Dispatch): IRecommendationDispatchProps {
  return {
    addToEvent: (addUser: IUser) =>
      dispatch(
        CompoundAction.create([
          OpenNavbarDialog.create("event"),
          AddPeopleToEvent.create(addUser)
        ])
      ),
    dismissRecommendationPopover: () =>
      dispatch(DisplayRecommendation.create(undefined)),
    writeHasSeenDisplayRecommendation: new DatabaseDispatcher(dispatch)
      .writeHasSeenDisplayRecommendation
  };
}

export const RecommendationDialog = connect(
  mapStoreToProps,
  mapDispatchToProps
)(PureRecommendation);
