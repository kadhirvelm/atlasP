import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Button, Classes, Dialog } from "@blueprintjs/core";
import User from "../../Helpers/User";
import IStoreState from "../../State/IStoreState";
import { SetMainPerson } from "../../State/WebsiteActions";
import { Autocomplete } from "../Common/Autocomplete";
import { IDialogProps } from "./DialogWrapper";

import "./FetchPerson.css";

export interface IFetchPersonStateProps {
    mainPerson?: User;
    userData?: { id?: User };
}

export interface IFetchPersonDispatchProps {
    setMainPerson(user: User): void;
}

class PureFetchPerson extends React.Component<IDialogProps & IFetchPersonStateProps & IFetchPersonDispatchProps> {
    public componentWillUpdate(nextProps: IDialogProps & IFetchPersonStateProps & IFetchPersonDispatchProps) {
        if (nextProps.mainPerson !== this.props.mainPerson) {
            this.setState({ fetchPerson: nextProps.mainPerson });
        }
    }

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
        mainPerson: state.WebsiteReducer.mainPerson,
        userData: state.GoogleReducer.userData,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IFetchPersonDispatchProps {
    return bindActionCreators({ setMainPerson: SetMainPerson.create }, dispatch);
}

export const FetchPerson = connect(mapStateToProps, mapDispatchToProps)(PureFetchPerson);
