import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { Button, Dialog } from "@blueprintjs/core";

import { DatabaseDispatcher } from "../../Dispatchers/DatabaseDispatcher";
import IStoreState from "../../State/IStoreState";
import { DisplayRecommendation } from "../../State/WebsiteActions";
import { IUser } from "../../Types/Users";

import "./Recommendation.scss";

export interface IRecommendationStoreProps {
  currentUser: IUser | undefined;
  displayRecommendation: IUser | undefined;
}

export interface IRecommendationDispatchProps {
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
        title={displayRecommendation.name}
      >
        <div className="recommendation">
          Hi {currentUser.name}, we thought you should see{" "}
          <strong>{displayRecommendation.name}</strong> this week. How are you
          feeling about that?
        </div>
        <div className="recommendation-actions-container">
          {this.renderIgnoreButton()}
          {this.renderCloseButton()}
          {this.renderInAnEvent(displayRecommendation)}
        </div>
      </Dialog>
    );
  }

  private renderIgnoreButton() {
    return (
      <Button
        className="recommendation-action"
        intent="danger"
        text="Absolutely not."
        onClick={this.handleCompleteDisplayDialog}
      />
    );
  }

  private renderInAnEvent(displayRecommendation: IUser) {
    return (
      <Button
        className="recommendation-action"
        intent="primary"
        text={`I'm seeing ${displayRecommendation.name} soon!`}
        onClick={this.handleCompleteDisplayDialog}
      />
    );
  }

  private handleCompleteDisplayDialog = () => {
    this.props.writeHasSeenDisplayRecommendation();
    this.props.dismissRecommendationPopover();
  };

  private renderCloseButton() {
    return (
      <Button
        className="recommendation-action"
        text="Remind me later"
        onClick={this.props.dismissRecommendationPopover}
      />
    );
  }
}

function mapStoreToProps(store: IStoreState): IRecommendationStoreProps {
  return {
    currentUser: store.DatabaseReducer.currentUser,
    displayRecommendation: store.WebsiteReducer.displayRecommendation
  };
}

function mapDispatchToProps(dispatch: Dispatch): IRecommendationDispatchProps {
  return {
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
