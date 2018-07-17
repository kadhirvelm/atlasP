import * as React from "react";

import { InputGroup } from "@blueprintjs/core";
import { handleStringChange } from "@blueprintjs/docs-theme";

import "./Autocomplete.css";

export interface IAutocompleteProps {
    dataSource?: {[key: string]: any};
    displayKey?: string;
    placeholderText: string;
    values?: string[];
    onSelection?(item: {}): void;
}

interface IAutocompleteState {
    searchText: string;
    openAutofill: boolean;
}

export class Autocomplete extends React.Component<IAutocompleteProps, IAutocompleteState> {
    public state = {
        openAutofill: false,
        searchText: "",
    };

    public componentDidMount() {
        this.handleSelection = this.handleSelection.bind(this);
    }

    public render() {
        return(
            <div className="total-container">
                <InputGroup
                    autoComplete="off"
                    type="text"
                    className="input-group"
                    onChange={this.handleChange()}
                    onClick={this.openAutofill}
                    placeholder={this.props.placeholderText}
                    value={this.state.searchText}
                />
                {this.maybeRenderAutofill()}
                {this.maybeRenderValues()}
            </div>
        );
    }

    private maybeRenderValues() {
        if (this.props.values == null) {
            return null;
        }
        return this.props.values.map( (value) => (
            <div className="autocomplete-tag">
                {value}
            </div>
        ))
    }

    private closeAutofill = () => this.setState({ openAutofill: false });
    private openAutofill = () => this.setState({ openAutofill: true });

    private maybeRenderAutofill() {
        if (this.state.openAutofill === false || this.props.dataSource == null || this.props.displayKey == null) {
            return null;
        }
        const dataSource = this.props.dataSource;
        const display = this.props.displayKey;
        return (
            <div className="autofill-container">
                {
                    Object.keys(dataSource)
                    .filter((key) => {
                        return key.includes(this.state.searchText) ||
                            dataSource[key][display].includes(this.state.searchText);
                    })
                    .map((key) => (
                        <div
                            className="autocomplete-row"
                            key={key}
                            onClick={this.handleSelection(key)}
                        >
                            {key} – {dataSource[key][display]}
                        </div>
                    ))
                }
            </div>
        );
    }

    private handleSelection(key: string) {
        return () => {
            if (this.props.onSelection != null && this.props.dataSource != null) {
                this.props.onSelection(this.props.dataSource[key]);
            }
            this.closeAutofill();
        }
    }

    private handleChange = () => {
        return handleStringChange((newValue) => this.setState({ searchText: newValue }));
    }
}
