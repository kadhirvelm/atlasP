import * as React from "react";

import { IIconProps } from "./icon";

export class GraphIcon extends React.PureComponent<IIconProps> {
    public render() {
        return (
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63 63" {...this.props.attributes}>
                <title>graph</title>
                <circle cx="6.19" cy="57.42" r="5.11"/>
                <circle cx="14.84" cy="17.33" r="6.17"/>
                <circle cx="35.88" cy="44.65" r="6.99"/>
                <circle cx="53.22" cy="9.85" r="8.57"/>
                <line style={ { strokeWidth: "1px" } } x1="6.19" y1="57.42" x2="14.84" y2="17.33"/>
                <line style={ { strokeWidth: "2px" } } x1="14.84" y1="17.33" x2="35.88" y2="44.65"/>
                <line style={ { strokeWidth: "3px" } } x1="35.88" y1="44.65" x2="53.22" y2="9.85"/>
            </svg>
        )
    }
}
