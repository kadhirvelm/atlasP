import * as classNames from "classnames";
import * as React from "react";

import { Icon, InputGroup } from "@blueprintjs/core";
import { handleStringChange } from "@blueprintjs/docs-theme";

import "./Autocomplete.css";

export interface IAutcompleteValuesProps {
    [key: string]: string;
}

export interface IAutocompleteProps {
    className?: string;
    dataSource?: {[key: string]: any};
    displayKey?: string;
    multiselection?: boolean;
    placeholderText?: string;
    values?: IAutcompleteValuesProps;
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
        window.addEventListener("keydown", this.handleKeyboardClick);
        window.addEventListener("click", this.handleOutsideClick);
    }

    public componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyboardClick);
    }

    public render() {
        return(
            <div id={this.id()} className={classNames(this.props.className, "total-container")}>
                <InputGroup
                    autoComplete="off"
                    type="text"
                    className="autofill-input"
                    leftIcon="search"
                    onChange={this.handleChange()}
                    onClick={this.openAutofill}
                    onFocus={this.openAutofill}
                    placeholder={this.props.placeholderText}
                    spellCheck={false}
                    value={this.state.searchText}
                />
                {this.maybeRenderAutofill()}
                <div className="rendered-values-container">
                    {this.maybeRenderValues()}
                </div>
            </div>
        );
    }

    private id = () => "Autocomplete#" + this.props.displayKey + this.props.placeholderText;

    private maybeRenderValues() {
        const { values } = this.props;
        if (values == null) {
            return null;
        }
        return Object.keys(values).map((key, index) => (
            <div className="autocomplete-tag" key={index}>
                {values[key]}
                <Icon className="autocomplete-remove" icon="cross" onClick={this.handleSelection(key)} />
            </div>
        ));
    }

    private handleOutsideClick = (event: MouseEvent) => {
        if (this.state.openAutofill) {
            const parentElement = document.getElementById(this.id());
            if (parentElement != null && !parentElement.contains(event.toElement)) {
                this.closeAutofill();
            }
        }
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
                        const searchText = this.state.searchText.toLowerCase();
                        return key.toLowerCase().includes(searchText) ||
                            dataSource[key][display].toLowerCase().includes(searchText);
                    })
                    .map((key, index) => (
                        <div
                            className={
                                classNames(
                                    "autocomplete-row",
                                    { "autocomplete-row-selected": this.isSelected(key) },
                                )
                            }
                            key={index}
                            onClick={this.handleSelection(key)}
                        >
                            <div className="value"> {dataSource[key][display]} </div>
                        </div>
                    ))
                }
            </div>
        );
    }

    private isSelected(key: string) {
        if (this.props.values !== undefined && this.props.values[key] != null) {
            return true;
        }
        return false;
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
            if (!this.props.multiselection) {
                this.closeAutofill();
            }
            this.setState({ searchText: "" });
        };
    }

    private handleChange = () => {
        return handleStringChange((newValue) => this.setState({ searchText: newValue }));
    }
}
