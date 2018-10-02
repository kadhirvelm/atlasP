import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { Button, EditableText, Intent } from "@blueprintjs/core";
import { DatabaseDispatcher } from "../../Dispatchers/DatabaseDispatcher";
import { PasswordField } from "../Common/PasswordField";

import "./Login.css";

export interface ILoginComponentDispatchProps {
    claim(phoneNumber: string): Promise<void>;
    login(phoneNumber: string, password: string): Promise<void>;
}

export interface ILoginComponentState {
    claimNumber: string;
    password: string;
    phoneNumber: string;
}

class PureLoginComponent extends React.Component<ILoginComponentDispatchProps, ILoginComponentState> {
    public state: ILoginComponentState = {
        claimNumber: "",
        password: "",
        phoneNumber: "",
    };

    public render() {
        return (
            <div className="centered fade-in">
                <div className="login-title">Welcome to AtlasP</div>
                <div className="login-center">
                    <div className="login-main-container">
                        <EditableText
                            className="login-textfield"
                            onChange={this.storeClaimNumber}
                            placeholder="Phone number…"
                        />
                        <Button
                            className="login-action-button"
                            disabled={this.checkClaim()}
                            id="claim-button"
                            intent={Intent.PRIMARY}
                            onClick={this.handleClaim}
                            text="Claim"
                        />
                    </div>
                    <div className="login-divider" />
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
                            disabled={this.checkSignIn()}
                            intent={Intent.NONE}
                            id="authorize-button"
                            onClick={this.handleLogin}
                            text="Sign In"
                        />
                    </div>
                </div>
            </div>
        )
    }

    private checkClaim() {
        return this.state.claimNumber === "";
    }

    private checkSignIn() {
        return this.state.phoneNumber === "" || this.state.password === "";
    }

    private storeClaimNumber = (claimNumber: string) => this.setState({ claimNumber })
    private storePhoneNumber = (phoneNumber: string) => this.setState({ phoneNumber })
    private storePassword = (password: string) => this.setState({ password });

    private handleClaim = () => this.props.claim(this.state.claimNumber);
    private handleLogin = () => this.props.login(this.state.phoneNumber, this.state.password);
}

function mapDispatchToProps(dispatch: Dispatch) {
    const databaseDispatcher = new DatabaseDispatcher(dispatch);
    return {
        claim: databaseDispatcher.claim,
        login: databaseDispatcher.login,
    }
}

export const LoginComponent = connect(undefined, mapDispatchToProps)(PureLoginComponent);
