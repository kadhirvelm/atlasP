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
        window.addEventListener("keydown", this.handleKeyboardClick)
    }

    public render() {
        return(
            <div className="total-container">
                <div className="values-container">
                    {this.maybeRenderValues()}
                    <InputGroup
                        autoComplete="off"
                        type="text"
                        className="autofill-input"
                        onChange={this.handleChange()}
                        onClick={this.openAutofill}
                        placeholder={this.props.placeholderText}
                        value={this.state.searchText}
                    />
                </div>
                {this.maybeRenderAutofill()}
            </div>
        );
    }

    private maybeRenderValues() {
        if (this.props.values == null) {
            return null;
        }
        return this.props.values.map( (value, index) => (
            <div className="autocomplete-tag" key={index}>
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
                    .map((key, index) => (
                        <div
                            className="autocomplete-row"
                            key={index}
                            onClick={this.handleSelection(key)}
                        >
                            {key} – {dataSource[key][display]}
                        </div>
                    ))
                }
            </div>
        );
    }

    private handleKeyboardClick = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            this.closeAutofill();
            event.preventDefault();
        }
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
