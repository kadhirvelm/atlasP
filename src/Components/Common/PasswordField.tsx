import classNames from "classnames";
import * as React from "react";

import { Classes } from "@blueprintjs/core";

export interface IPasswordFieldProps {
    className?: string;
    placeHolder?: string;
    onChange(value: string): void;
}

export class PasswordField extends React.PureComponent<IPasswordFieldProps> {
    public render() {
        return (
            <input type="password" className={classNames(Classes.EDITABLE_TEXT_INPUT, this.props.className)} placeholder={this.props.placeHolder} onChange={this.handleOnChange} />
        )
    }

    private handleOnChange = (value: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChange(value.currentTarget.value);
    }
}
