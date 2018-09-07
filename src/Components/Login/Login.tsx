import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { Button, EditableText, Intent } from "@blueprintjs/core";
import { DatabaseDispatcher } from "../../Dispatchers/DatabaseDispatcher";

import "./Login.css";

export interface ILoginComponentDispatchProps {
    claim(phoneNumber: string): Promise<void>;
    login(phoneNumber: string, password: string): Promise<void>;
}

export interface ILoginComponentState {
    password: string;
    phoneNumber: string;
}

class PureLoginComponent extends React.Component<ILoginComponentDispatchProps, ILoginComponentState> {
    public state: ILoginComponentState = {
        password: "",
        phoneNumber: "",
    };

    public render() {
        return (
            <div className="centered fade-in">
                <h2>Welcome to AtlasP</h2>
                <div className="center-login">
                    <div className="details">
                        <EditableText
                            className="textfield"
                            onConfirm={this.storePhoneNumber}
                            placeholder="Phone number"
                        />
                        <EditableText
                            className="textfield"
                            onConfirm={this.storePassword}
                            placeholder="Password"
                        />
                    </div>
                    <div className="action-buttons">
                        <Button
                            className="action-button"
                            disabled={this.checkClaim()}
                            id="claim-button"
                            intent={Intent.NONE}
                            onClick={this.handleClaim}
                            text="Claim Account"
                        />
                        <Button
                            className="action-button"
                            disabled={this.checkSignIn()}
                            intent={Intent.PRIMARY}
                            id="authorize-button"
                            onClick={this.handleLogin}
                            text="Sign In"
                        />
                    </div>
                </div>
            </div>
        )
    }

    private checkSignIn() {
        return this.state.phoneNumber === "" || this.state.password === "";
    }

    private checkClaim() {
        return this.state.phoneNumber === "";
    }

    private storePhoneNumber = (phoneNumber: string) => this.setState({ phoneNumber })
    private storePassword = (password: string) => this.setState({ password });

    private handleLogin = () => this.props.login(this.state.phoneNumber, this.state.password);
    private handleClaim = () => this.props.claim(this.state.phoneNumber);
}

function mapDispatchToProps(dispatch: Dispatch) {
    const databaseDispatcher = new DatabaseDispatcher(dispatch);
    return {
        claim: databaseDispatcher.claim,
        login: databaseDispatcher.login,
    }
}

export const LoginComponent = connect(undefined, mapDispatchToProps)(PureLoginComponent);
