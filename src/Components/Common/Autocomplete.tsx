import * as React from "react";

import { InputGroup } from "@blueprintjs/core";
import { handleStringChange } from "@blueprintjs/docs-theme";

export interface IAutocompleteProps {
    dataSource?: {[key: string]: any};
    displayKey?: string;
    placeholderText: string;
    onSelection(item: {}): void;
}

interface IAutocompleteState {
    searchText: string;
}

export class Autocomplete extends React.Component<IAutocompleteProps, IAutocompleteState> {
    public state = {
        searchText: "",
    };

    public render() {
        return(
            <div>
                <InputGroup
                    autoComplete="off"
                    type="text"
                    className="input-group"
                    onChange={this.handleChange()}
                    placeholder={this.props.placeholderText}
                    value={this.state.searchText}
                />
                <div>
                    {this.maybeRenderAutofill()}
                </div>
            </div>
        );
    }

    private maybeRenderAutofill() {
        if (this.props.dataSource == null || this.props.displayKey == null) {
            return null;
        }
        const dataSource = this.props.dataSource;
        const display = this.props.displayKey;
        return Object.keys(dataSource)
            .filter((key) => {
                return key.includes(this.state.searchText) ||
                    dataSource[key][display].includes(this.state.searchText);
            })
            .map((key) => (
            <div key={key}>{key} - {dataSource[key][display]}</div>
        ));
    }

    private handleChange = () => {
        return handleStringChange((newValue) => this.setState({ searchText: newValue }));
    }
}
