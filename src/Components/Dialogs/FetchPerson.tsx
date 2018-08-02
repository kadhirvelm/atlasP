import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Button, Classes, Dialog, Intent } from "@blueprintjs/core";
import User from "../../Helpers/User";
import IStoreState from "../../State/IStoreState";
import { SetMainPerson } from "../../State/WebsiteActions";
import { Autocomplete } from "../Common/Autocomplete";

import "./FetchPerson.css";

interface IFetchPersonProps {
    handleMainPersonDialogClose: () => void;
    readonly mainPersonDialogOpen: boolean;
}

interface IFetchPersonState {
    fetchPerson?: User;
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
        fetchPerson: this.props.mainPerson,
    };

    public componentWillUpdate(nextProps: IFetchPersonProps & IFetchPersonStateProps & IFetchPersonDispatchProps) {
        if (nextProps.mainPerson !== this.props.mainPerson) {
            this.setState({ fetchPerson: nextProps.mainPerson });
        }
    }

    public render() {
        return(
            <Dialog
                icon="inbox"
                isOpen={this.props.mainPersonDialogOpen}
                onClose={this.props.handleMainPersonDialogClose}
                title="Fetch Specific Person"
            >
                <div className={Classes.DIALOG_BODY}>
                    <div className="flexbox-row flexbox-baseline">
                        <Autocomplete
                            className="autocomplete-margin"
                            dataSource={this.props.userData}
                            displayKey="name"
                            placeholderText="Search for person..."
                            values={this.returnPersonValue()}
                            onSelection={this.handleSelection}
                        />
                    </div>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button text="Cancel" onClick={this.props.handleMainPersonDialogClose} />
                    <Button
                        onClick={this.changeMainPerson}
                        intent={Intent.PRIMARY}
                        text="Select"
                        disabled={this.state.fetchPerson === undefined}
                    />
                    </div>
                </div>
            </Dialog>
        );
    }

    private fetchPersonIsDefined(fetchPerson: User | undefined): fetchPerson is User {
        return fetchPerson !== undefined;
    }

    private returnPersonValue() {
        const { fetchPerson } = this.state;
        return this.fetchPersonIsDefined(fetchPerson) ? {[fetchPerson.id]: fetchPerson.name} : undefined;
    }

    private handleSelection = (fetchPerson: User) => this.setState({ fetchPerson });
    private changeMainPerson = () => {
        const { fetchPerson } = this.state;
        if (this.props.userData && this.fetchPersonIsDefined(fetchPerson)) {
            this.props.setMainPerson(fetchPerson);
            this.props.handleMainPersonDialogClose();
            this.setState({ fetchPerson: undefined });
        }
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
