import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Icon } from "@blueprintjs/core";

import { AtlasPIcon } from "../../icons/atlaspLogoIcon";
import { GraphIcon } from "../../icons/graphIcon";
import { NewEventIcon } from "../../icons/newEventIcon";
import { NewPersonIcon } from "../../icons/newPersonIcon";
import { EmptyDatabaseCache } from "../../State/DatabaseActions";
import IStoreState from "../../State/IStoreState";
import { IForceUpdate } from "../../Types/Other";
import { IUser } from "../../Types/Users";
import { AddNewEvent } from "../Dialogs/AddNewEvent";
import { AddNewPerson } from "../Dialogs/AddNewUser";
import { DialogWrapper } from "../Dialogs/DialogWrapper";
import { UpdateUser } from "../Dialogs/UpdateUser";
import { Filters } from "./NavbarComponents/Filters/Filters";
import { GraphType } from "./NavbarComponents/GraphType/GraphType";
import { NavbarRow } from "./NavbarRow";

import "../Main.scss";
import "./Navbar.scss";

const ICON_SIZE = 25;

interface INavbarState {
  isHovering: boolean;
  handleHoverLeave(): void;
}

export interface INavbarStateProps {
  currentUser?: IUser;
  fetching: boolean;
  forceUpdate: IForceUpdate | undefined;
  isPremium: boolean;
}

export interface INavbarDispatchProps {
  signOut(): void;
}

class PureAtlaspNavbar extends React.PureComponent<
  INavbarStateProps & INavbarDispatchProps,
  INavbarState
> {
  public state = {
    // HACK: remove this once the navbar rows slide open
    handleHoverLeave: () => this.setState({ isHovering: false }),
    isHovering: false
  };
  public customAttributes = {
    height: ICON_SIZE,
    style: {
      fill: "white",
      minHeight: ICON_SIZE,
      minWidth: ICON_SIZE,
      stroke: "white"
    },
    width: ICON_SIZE
  };

  public render() {
    return (
      <div
        className={classNames("atlas-navbar", "bp3-dark", {
          hover: this.state.isHovering
        })}
        onMouseEnter={this.handleHoverStart}
        onMouseLeave={this.handleHoverLeave}
        style={{ zIndex: 10 }}
      >
        {this.renderLogo()}
        <div className="navbar-separator" />
        {this.renderAdditionItems()}
        <div className="navbar-separator" />
        {this.renderGraphItems()}
        <div className="navbar-separator" />
        {this.renderUserAccountItems()}
      </div>
    );
  }

  private renderLogo() {
    return (
      <>
        <NavbarRow
          handleHoverLeave={this.handleHoverLeave}
          isHovering={this.state.isHovering}
          icon={
            <AtlasPIcon
              attributes={{
                height: 30,
                style: {
                  fill: "white",
                  minHeight: 30,
                  minWidth: 25
                },
                width: 25
              }}
            />
          }
          text="AtlasP"
        />
      </>
    );
  }

  private renderGraphItems() {
    return (
      <>
        <NavbarRow
          componentHeight={175}
          handleHoverLeave={this.handleHoverLeave}
          isHovering={this.state.isHovering}
          icon={<GraphIcon attributes={this.customAttributes} />}
          text="Graph Type"
        >
          <GraphType />
        </NavbarRow>
        <NavbarRow
          componentHeight={this.props.isPremium ? 250 : 150}
          handleHoverLeave={this.handleHoverLeave}
          isHovering={this.state.isHovering}
          icon={<Icon icon="filter" iconSize={ICON_SIZE} />}
          text="Filters"
        >
          <Filters />
        </NavbarRow>
      </>
    );
  }

  private renderAdditionItems() {
    return (
      <>
        <DialogWrapper
          className="navbar-new-person"
          containerElement={NavbarRow}
          dialog={AddNewPerson}
          elementProps={this.state}
          icon={<NewPersonIcon attributes={this.customAttributes} />}
          text="Add person"
        />
        <DialogWrapper
          className="navbar-new-event"
          containerElement={NavbarRow}
          dialog={AddNewEvent}
          elementProps={this.state}
          icon={<NewEventIcon attributes={this.customAttributes} />}
          text="Add event"
        />
      </>
    );
  }

  private renderUserAccountItems() {
    return (
      <>
        <DialogWrapper
          className="navbar-account"
          containerElement={NavbarRow}
          dialog={UpdateUser}
          dialogProps={{ forceUpdate: this.props.forceUpdate }}
          elementProps={this.state}
          forceOpen={this.props.forceUpdate !== undefined}
          icon={<Icon icon="user" iconSize={ICON_SIZE} />}
          text="Account"
        />
        <div className="navbar-logout-separator" />
        <NavbarRow
          handleHoverLeave={this.handleHoverLeave}
          isHovering={this.state.isHovering}
          icon={<Icon icon="log-out" iconSize={ICON_SIZE} />}
          onClick={this.props.signOut}
          text="Sign out"
        />
      </>
    );
  }

  private handleHoverStart = () => this.setState({ isHovering: true });
  private handleHoverLeave = () => this.setState({ isHovering: false });
}

function mapStateToProps(state: IStoreState): INavbarStateProps {
  return {
    currentUser: state.DatabaseReducer.currentUser,
    fetching: state.DatabaseReducer.isFetching,
    forceUpdate: state.DatabaseReducer.forceUpdate,
    isPremium: state.DatabaseReducer.isPremium
  };
}

function mapDispatchToProps(dispatch: Dispatch): INavbarDispatchProps {
  return bindActionCreators({ signOut: EmptyDatabaseCache.create }, dispatch);
}

export const AtlaspNavbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(PureAtlaspNavbar);
