import * as React from "react";
import { connect } from "react-redux";

import { Button, Classes, Dialog } from "@blueprintjs/core";

import IStoreState from "../../State/IStoreState";
import { IUser, IUserMap } from "../../Types/Users";
import User from "../../Utils/User";
import { Autocomplete } from "../Common/Autocomplete";
import { IDialogProps } from "./DialogWrapper";

import "./FetchPerson.css";

export interface IFetchPersonStateProps {
    currentUser?: IUser;
    userData?: IUserMap;
}

export interface IFetchPersonDispatchProps {
    setMainPerson(user: User): void;
}

class PureFetchPerson extends React.Component<IDialogProps & IFetchPersonStateProps & IFetchPersonDispatchProps> {
    public render() {
        return(
            <Dialog
                icon="inbox"
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
                title="Fetch Specific Person"
            >
                <div className={Classes.DIALOG_BODY}>
                    <div className="flexbox-row flexbox-baseline">
                        <Autocomplete
                            className="autocomplete-margin"
                            dataSource={this.props.userData}
                            displayKey="name"
                            placeholderText="Search for person..."
                            onSelection={this.handleSelection}
                        />
                    </div>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button text="Cancel" onClick={this.props.onClose} />
                    </div>
                </div>
            </Dialog>
        );
    }

    private handleSelection = (fetchPerson: User) => {
        this.props.setMainPerson(fetchPerson);
        this.props.onClose();
    }
}

function mapStateToProps(state: IStoreState): IFetchPersonStateProps {
    return {
        currentUser: state.DatabaseReducer.currentUser,
        userData: state.DatabaseReducer.userData,
    };
}

export const FetchPerson = connect(mapStateToProps)(PureFetchPerson);
