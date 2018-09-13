import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { Classes, Dialog, FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import { handleStringChange } from "@blueprintjs/docs-theme";

import IStoreState from "../../State/IStoreState";
import { IUserMap } from "../../Types/Users";
import { DialogUtils } from "./DialogUtils";

import { showToast } from "../../Utils/Toaster";
import "./AddNewEvent.css";

export interface IAddNewPersonStateProps {
    users: IUserMap | undefined;
}

export interface IAddNewPersonDispatchProps {
    dialogUtils: DialogUtils;
}

interface IAddNewPersonProps {
    isOpen: boolean;
    onClose(): void;
}

export interface IFinalPerson {
    name: string,
    gender: string,
    age: string,
    location: string,
}

export interface IAddNewPersonState {
    finalPerson: IFinalPerson;
    isLoading: boolean;
}

const EMPTY_STATE: IAddNewPersonState = {
    finalPerson: {
        age: "",
        gender: "X",
        location: "",
        name: "",
    },
    isLoading: false,
}

export class PureAddNewPerson extends React.Component<
    IAddNewPersonProps & IAddNewPersonStateProps & IAddNewPersonDispatchProps, IAddNewPersonState> {
    public state: IAddNewPersonState = EMPTY_STATE;

    public render() {
        return(
            <Dialog
                canEscapeKeyClose={false}
                isOpen={this.props.isOpen}
                onClose={this.resetStateAndClose}
                title="Add New Person"
            >
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup>
                        <InputGroup className="input-group" onChange={this.handleChange("name")} placeholder="Full name" />
                        <InputGroup className="input-group" onChange={this.handleChange("gender")} placeholder="Gender (M, F or X)" />
                        <InputGroup className="input-group" onChange={this.handleChange("age")} placeholder="Age" />
                        <InputGroup className="input-group" onChange={this.handleChange("location")} placeholder="Location" />
                    </FormGroup>
                </div>
                {this.props.dialogUtils.returnFooterActions(this.props.onClose, this.handleSubmit)}
            </Dialog>
        );
    }

    private resetStateAndClose = () => {
        this.setState(EMPTY_STATE, () => {
            this.props.onClose();
        });
    }

    private handleSubmit = () => {
        this.setState({ isLoading: true }, async () => {
            try {
                const { finalPerson } = this.state;
                await this.props.dialogUtils.submitFinalPerson(finalPerson);
                showToast(Intent.SUCCESS, "Successfully created new user.");
                this.props.onClose();
            } catch (error) {
                this.setState({ isLoading: false });
            }
        });
    }

    private handleChange = (key: string) => {
        return handleStringChange(
            (newValue) => {
                this.adjustFinalPerson(key, newValue);
        });
    }
    
    private adjustFinalPerson = (key: string, newValue: any) => {
        this.setState({ finalPerson: {...this.state.finalPerson, [key]: newValue } });
    }
}

function mapStateToProps(state: IStoreState): IAddNewPersonStateProps {
    return {
        users: state.DatabaseReducer.userData,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IAddNewPersonDispatchProps {
    return {
        dialogUtils: new DialogUtils(dispatch),
    };
}

export const AddNewPerson = connect(mapStateToProps, mapDispatchToProps)(PureAddNewPerson);
