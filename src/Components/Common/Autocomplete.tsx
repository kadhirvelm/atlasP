import classNames from "classnames";
import * as React from "react";

import { Icon, InputGroup } from "@blueprintjs/core";

import "./Autocomplete.scss";
import { isInsideDiv } from "./utils";

export interface IAutcompleteValuesProps {
  [key: string]: string;
}

export interface IAutocompleteProps {
  className?: string;
  dataSource?: Map<string, any>;
  displayKey?: string;
  multiselection?: boolean;
  placeholderText?: string;
  values?: IAutcompleteValuesProps;
  onSelection?(item: {}): void;
}

interface IAutocompleteState {
  hovering: number;
  searchText: string;
  openAutofill: boolean;
}

export class Autocomplete extends React.PureComponent<
  IAutocompleteProps,
  IAutocompleteState
> {
  public state = {
    hovering: -1,
    openAutofill: false,
    searchText: ""
  };
  public container: HTMLDivElement | null = null;
  public ref: HTMLDivElement | null = null;
  public setRef = {
    container: (ref: HTMLDivElement) => (this.container = ref),
    div: (ref: HTMLDivElement) => (this.ref = ref)
  };

  public componentDidMount() {
    this.handleSelection = this.handleSelection.bind(this);
  }

  public addEventListeners = () => {
    window.addEventListener("keydown", this.handleKeyboardClick);
    window.addEventListener("click", this.handleOutsideClick);
  };

  public removeEventListeners = () => {
    if (this.container !== null) {
      this.container.blur();
    }
    window.removeEventListener("keydown", this.handleKeyboardClick);
    window.removeEventListener("click", this.handleOutsideClick);
  };

  public render() {
    return (
      <div
        id={this.id()}
        className={classNames(this.props.className, "total-container")}
        onFocus={this.addEventListeners}
        ref={this.setRef.container}
      >
        <InputGroup
          autoComplete="off"
          type="text"
          className="autofill-input"
          leftIcon="search"
          onChange={this.handleChange}
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

  private id = () =>
    "Autocomplete#" + this.props.displayKey + this.props.placeholderText;

  private maybeRenderValues() {
    const { values } = this.props;
    if (values == null) {
      return null;
    }
    return Object.keys(values).map((key, index) => (
      <div className="autocomplete-tag" key={index}>
        {values[key]}
        <Icon
          className="autocomplete-remove"
          icon="cross"
          onClick={this.handleSelection(key)}
        />
      </div>
    ));
  }

  private handleOutsideClick = (event: MouseEvent) => {
    if (
      !this.state.openAutofill ||
      this.ref === null ||
      this.container === null
    ) {
      return;
    }

    if (
      !isInsideDiv(
        event,
        this.ref,
        this.container.getBoundingClientRect().left,
        this.container.getBoundingClientRect().top
      )
    ) {
      this.closeAutofill();
    }
  };
  private closeAutofill = () => {
    this.setState({ openAutofill: false });
    this.removeEventListeners();
  };
  private openAutofill = () => this.setState({ openAutofill: true });

  private maybeRenderAutofill() {
    if (
      this.state.openAutofill === false ||
      this.props.dataSource == null ||
      this.props.displayKey == null
    ) {
      return null;
    }
    const dataSource = this.props.dataSource;
    const display = this.props.displayKey;
    return (
      <div className="autofill-container" ref={this.setRef.div}>
        {Array.from(dataSource.keys())
          .filter(key => {
            const searchText = this.state.searchText.toLowerCase();
            return (
              key.toLowerCase().includes(searchText) ||
              dataSource
                .get(key)
                [display].toLowerCase()
                .includes(searchText)
            );
          })
          .map((key, index) => (
            <div
              className={classNames("autocomplete-row", {
                "autocomplete-row-selected": this.isSelected(key),
                hovering: this.state.hovering === index
              })}
              key={index}
              onClick={this.handleSelection(key)}
            >
              <div className="value"> {dataSource.get(key)[display]} </div>
            </div>
          ))}
      </div>
    );
  }

  private isSelected(key: string) {
    if (this.props.values === undefined || this.props.values[key] == null) {
      return false;
    }
    return true;
  }

  private handleKeyboardClick = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      this.closeAutofill();
      event.preventDefault();
    }

    const { dataSource } = this.props;
    const { hovering } = this.state;
    if (dataSource === undefined) {
      return;
    }

    if (event.key === "ArrowDown") {
      this.setState(
        {
          hovering: Math.min(this.state.hovering + 1, dataSource.size - 1)
        },
        this.scrollToHovered
      );
    } else if (event.key === "ArrowUp") {
      this.setState(
        { hovering: Math.max(0, this.state.hovering - 1) },
        this.scrollToHovered
      );
    } else if (event.key === "Enter" && hovering !== -1) {
      this.handleSelection(Array.from(dataSource.keys())[hovering])();
    }
  };

  private scrollToHovered = () => {
    if (this.ref !== null) {
      this.ref.scrollTo({
        behavior: "smooth",
        top: this.state.hovering * 38
      });
    }
  };

  private handleSelection(key: string) {
    return () => {
      if (this.props.onSelection != null && this.props.dataSource != null) {
        this.props.onSelection(this.props.dataSource.get(key));
      }

      if (!this.props.multiselection) {
        this.closeAutofill();
      }

      this.setState({
        hovering: this.props.multiselection === true ? this.state.hovering : -1,
        searchText: ""
      });
    };
  }

  private handleChange = (event: React.FormEvent<HTMLElement>) =>
    this.setState({ searchText: (event.target as any).value });
}
