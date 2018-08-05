import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { Classes, Dialog, FormGroup, InputGroup } from "@blueprintjs/core";
import { handleStringChange } from "@blueprintjs/docs-theme";

import IStoreState, { IUserMap } from "../../State/IStoreState";
import { DialogUtils } from "./DialogUtils";

import "./AddNewEvent.css";

export interface IAddNewPersonStateProps {
    rawData: any;
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
    fullName: string,
    gender: string,
    age: string,
    location: string,
}

export interface IAddNewPersonState {
    finalPerson: IFinalPerson;
}

const EMPTY_STATE: IAddNewPersonState = {
    finalPerson: {
        age: "",
        fullName: "",
        gender: "X",
        location: "",
    },
}

export class PureAddNewPerson extends React.Component<
    IAddNewPersonProps & IAddNewPersonStateProps & IAddNewPersonDispatchProps, IAddNewPersonState> {
    public state: IAddNewPersonState = EMPTY_STATE;

    public componentDidMount() {
        this.props.dialogUtils.setReset(this.resetStateAndClose);
    }

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
                        <InputGroup className="input-group" onChange={this.handleChange("fullName")} placeholder="Full name" />
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
        const { finalPerson } = this.state;
        this.props.dialogUtils.setData(this.props.rawData);
        this.props.dialogUtils.submitFinalPerson(finalPerson);
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
        rawData: state.GoogleReducer.rawData,
        users: state.GoogleReducer.userData,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IAddNewPersonDispatchProps {
    return {
        dialogUtils: new DialogUtils(dispatch),
    };
}

export const AddNewPerson = connect(mapStateToProps, mapDispatchToProps)(PureAddNewPerson);
