import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { Button, EditableText, Intent } from "@blueprintjs/core";

import { DatabaseDispatcher } from "../../Dispatchers/DatabaseDispatcher";
import { isValidPhoneNumber } from "../../Utils/Util";
import { PasswordField } from "../Common/PasswordField";

import { showToast } from "../../Utils/Toaster";
import "./Login.scss";

export interface ILoginComponentDispatchProps {
  claim(phoneNumber: string): Promise<void>;
  login(phoneNumber: string, password: string): Promise<void>;
  reset(phoneNumber: string): Promise<{}>;
}

export interface ILoginComponentState {
  claimNumber: string;
  isLoading: boolean;
  password: string;
  phoneNumber: string;
}

class PureLoginComponent extends React.PureComponent<
  ILoginComponentDispatchProps,
  ILoginComponentState
> {
  public state: ILoginComponentState = {
    claimNumber: "",
    isLoading: false,
    password: "",
    phoneNumber: ""
  };

  public render() {
    return (
      <div
        className="centered fade-in login-parent-container"
        onKeyDown={this.handleKeyboard}
      >
        <div className="login-title">Welcome to AtlasP</div>
        <div className="login-center">
          <div className="login-main-container">
            <EditableText
              className="login-textfield"
              onChange={this.storePhoneNumber}
              placeholder="Phone number…"
            />
            <PasswordField
              className="login-textfield"
              onChange={this.storePassword}
              placeHolder="Password…"
            />
            <Button
              className="login-action-button"
              disabled={!this.isValidSignIn()}
              intent={Intent.NONE}
              id="authorize-button"
              loading={this.state.isLoading}
              onClick={this.handleLogin}
              text="Sign In"
            />
            <div className="login-reset-link" onClick={this.resetPassword}>
              Reset password
            </div>
          </div>
          <div className="login-divider" />
          <div className="login-main-container">
            <EditableText
              className="login-textfield"
              onChange={this.storeClaimNumber}
              placeholder="Phone number…"
            />
            <Button
              className="login-action-button"
              disabled={!this.isValidClaim()}
              id="claim-button"
              intent={Intent.PRIMARY}
              onClick={this.handleClaim}
              text="Claim"
            />
          </div>
        </div>
      </div>
    );
  }

  private resetPassword = () => {
    if (!isValidPhoneNumber(this.state.phoneNumber)) {
      showToast(
        Intent.WARNING,
        "Enter your phone number in the first text field then click the “Reset password” link again."
      );
      return;
    }
    this.setState({ isLoading: true }, async () => {
      await this.props.reset(this.state.phoneNumber);
      this.setState(
        { isLoading: false, claimNumber: this.state.phoneNumber },
        () => {
          this.handleClaim();
        }
      );
    });
  };

  private handleKeyboard = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter") {
      if (this.isValidSignIn()) {
        this.handleLogin();
      } else if (this.isValidClaim()) {
        this.handleClaim();
      }
    }
  };

  private isValidClaim() {
    return isValidPhoneNumber(this.state.claimNumber);
  }

  private isValidSignIn() {
    return (
      isValidPhoneNumber(this.state.phoneNumber) && this.state.password !== ""
    );
  }

  private storeClaimNumber = (claimNumber: string) =>
    this.setState({ claimNumber });
  private storePhoneNumber = (phoneNumber: string) =>
    this.setState({ phoneNumber });
  private storePassword = (password: string) => this.setState({ password });

  private handleClaim = () => this.props.claim(this.state.claimNumber);
  private handleLogin = () =>
    this.props.login(this.state.phoneNumber, this.state.password);
}

function mapDispatchToProps(dispatch: Dispatch): ILoginComponentDispatchProps {
  const databaseDispatcher = new DatabaseDispatcher(dispatch);
  return {
    claim: databaseDispatcher.claim,
    login: databaseDispatcher.login,
    reset: databaseDispatcher.resetClaim
  };
}

export const LoginComponent = connect(
  undefined,
  mapDispatchToProps
)(PureLoginComponent);
