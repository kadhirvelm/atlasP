import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Button, Classes, Dialog, EditableText, Intent } from "@blueprintjs/core";
import User from "../Helpers/User";
import IStoreState from "../State/IStoreState";
import { SetMainPerson } from "../State/WebsiteActions";

import "./FetchPerson.css";

interface IFetchPersonProps {
    handleMainPersonDialogClose: () => void;
    readonly mainPersonDialogOpen: boolean;
}

interface IFetchPersonState {
    id: string;
}

export interface IFetchPersonStateProps {
    mainPerson?: User;
    userData?: { id?: User };
}

export interface IFetchPersonDispatchProps {
    setMainPerson(user: User): void;
}

class PureFetchPerson extends React.Component<
    IFetchPersonProps & IFetchPersonStateProps & IFetchPersonDispatchProps,
    IFetchPersonState> {
    public state = {
        id: "",
    };

    public render() {
        return(
            <Dialog
                icon="inbox"
                isOpen={this.props.mainPersonDialogOpen}
                onClose={this.props.handleMainPersonDialogClose}
                title="Fetch Specific Person"
            >
                <div className={Classes.DIALOG_BODY}>
                    {this.props.mainPerson ? this.renderCurrentPerson(this.props.mainPerson) : "Unknown"}
                    <div className="flexbox-row flexbox-baseline">
                        <div className="flexbox-row" style={{ flexBasis: "50%", justifyContent: "flex-end" }}>
                            <h2 style={{ marginTop: "25px" }}>
                                <EditableText
                                    intent={Intent.PRIMARY}
                                    maxLength={4}
                                    placeholder="Enter ID"
                                    value={this.state.id}
                                    onChange={this.changeValue}
                                />
                            </h2>
                        </div>
                        <div className="flexbox-row" style={{ flexBasis: "50%", justifyContent: "flex-start" }}>
                            <h3 style={{ marginLeft: "15px", color: "#1D8348" }}>
                                {this.maybeRenderFullName()}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button text="Cancel" onClick={this.props.handleMainPersonDialogClose} />
                    <Button
                        onClick={this.changeMainPerson}
                        intent={Intent.PRIMARY}
                        text="Select"
                        disabled={!(this.props.userData && this.props.userData[this.state.id])}
                    />
                    </div>
                </div>
            </Dialog>
        );
    }

    private maybeRenderFullName() {
        if (this.state.id && this.props.userData && this.props.userData[this.state.id]) {
            return this.props.userData[this.state.id].fullName;
        }
        return "Error Fetching Name";
    }

    private changeValue = (value: string) => this.setState({ id: value });
    private changeMainPerson = () => {
        if (this.props.userData) {
            this.props.setMainPerson(this.props.userData[this.state.id]);
            this.props.handleMainPersonDialogClose();
            this.setState({ id: "" });
        }
    }
    private renderCurrentPerson(user: User) {
        return(
            <div>
                Current: <b> {user.name} - {user.id} </b>
            </div>
        );
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
