import * as classNames from "classnames";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { Button, Classes, Dialog, EditableText, Icon, IconName, Intent } from "@blueprintjs/core";

import { DatabaseDispatcher } from "../../Dispatchers/DatabaseDispatcher";
import IStoreState from "../../State/IStoreState";
import { IForceUpdate } from "../../Types/Other";
import { IUser } from "../../Types/Users";
import { showToast } from "../../Utils/Toaster";
import { PasswordField } from "../Common/PasswordField";
import { IDialogProps } from "./DialogWrapper";

import "./UpdateUser.css";

export interface IUpdateUserStoreProps {
    currentUser?: IUser;
    forceUpdate?: IForceUpdate;
}

export interface IUpdateUserDispatchProps {
    updateUser(newUser: IUser): void;
}

export interface IUpdateUserState {
    currentUser?: IUser;
    isLoading: boolean;
}

class PureUpdateUser extends React.Component<IDialogProps & IUpdateUserStoreProps & IUpdateUserDispatchProps> {
    public state = {
        currentUser: this.props.currentUser,
        isLoading: false,
    };

    private fields: { [key: number]: [IconName, keyof IUser] } = {
        1: ["person", "name"],
        2: ["phone", "contact"],
        3: ["key-escape", "gender"],
        4: ["map-marker", "location"]
    }

    public componentDidMount() {
        this.maybeShowErrorToast();
    }

    public render() {
        const { currentUser } = this.state;
        if (currentUser === undefined) {
            return null;
        }
        return (
            <Dialog
                canEscapeKeyClose={!this.isForcedAction()}
                canOutsideClickClose={false}
                icon="edit"
                onClose={this.props.onClose}
                isCloseButtonShown={!this.isForcedAction()}
                isOpen={this.props.isOpen}
                title="Update User"
            >
                <div className={classNames(Classes.DIALOG_BODY, "all-fields-container")}>
                    <div className="user-fields-container">
                        {Object.values(this.fields).map((value) => this.renderField(currentUser, value[0], value[1])
                        )}
                    </div>
                    <div className="change-password">
                        {this.renderField(currentUser, "lock", "password")}
                    </div>
                </div>
                <div className={classNames(Classes.DIALOG_FOOTER, Classes.DIALOG_FOOTER_ACTIONS)}>
                    <Button intent={Intent.NONE} text="Cancel" disabled={this.isForcedAction()} onClick={this.props.onClose} />
                    <Button intent={Intent.PRIMARY} loading={this.state.isLoading} text="Save" onClick={this.submitChangeUser}/>
                </div>
            </Dialog>
        );
    }

    private isForcedAction() {
        return this.props.forceUpdate !== undefined;
    }

    private renderField(currentUser: IUser, icon: IconName, key: string) {
        return (
            <div className="render-field-container" key={key}>
                <Icon className="render-field-icon" icon={icon} title={key} />
                <div className="render-field-divider" />
                {this.renderTextfield(currentUser, key)}
            </div>
        )
    }

    private renderTextfield(currentUser: IUser, key: string) {
        if (key === "password") {
            return <PasswordField className={classNames("render-field-text", { error: this.checkIfInForceUpdate(key) })} placeHolder="Change password..." onChange={this.editUser(key)} />
        }
        return <EditableText className={classNames("render-field-text", { error: this.checkIfInForceUpdate(key) })} onChange={this.editUser(key)} value={currentUser[key]} />
    }

    private checkIfInForceUpdate(key: string) {
        const { forceUpdate } = this.props;
        if (forceUpdate === undefined) {
            return false;
        }
        return forceUpdate.fields === key;
    }

    private editUser(key: string) {
        return (newValue: string) => this.setState({ currentUser: { ...this.state.currentUser, [key]: newValue } });
    }

    private submitChangeUser = () => {
        const { currentUser } = this.state;
        if (this.containsErrors() || currentUser === undefined) {
            return;
        }
        this.setState({ isLoading: true }, async () => {
            try {
                await this.props.updateUser(currentUser);
                showToast(Intent.SUCCESS, "Successfully updated account details.");
                this.props.onClose();
            } finally {
                this.setState({ isLoading: false });
            }
        });
    }
    
    private containsErrors() {
        if (this.props.forceUpdate && this.props.currentUser !== undefined && this.state.currentUser !== undefined) {
            const changeField = this.props.forceUpdate.fields;
            if (this.props.currentUser[changeField] === this.state.currentUser[changeField]) {
                this.maybeShowErrorToast();
                return true;
            }
        }
        return false;
    }

    private maybeShowErrorToast() {
        if (this.props.forceUpdate !== undefined) {
            showToast(Intent.WARNING, `Before moving on, please update your ${this.props.forceUpdate.fields}.`)
        }
    }
}

function mapStateToProps(state: IStoreState): IUpdateUserStoreProps {
    return {
        currentUser: state.DatabaseReducer.currentUser,
        forceUpdate: state.DatabaseReducer.forceUpdate,
    }
}

function mapDispatchToProps(dispatch: Dispatch): IUpdateUserDispatchProps {
    return {
        updateUser: new DatabaseDispatcher(dispatch).updateUser
    }
}

export const UpdateUser = connect(mapStateToProps, mapDispatchToProps)(PureUpdateUser);
