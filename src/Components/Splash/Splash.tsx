import * as React from "react";

import "./Splash.css";

const bg = require("./background.jpg");

export interface IMatchParams {
    match: {
        params: {
            to: string;
            from: string;
        },
    };
}

export class SplashPage extends React.PureComponent<IMatchParams> {
    public render() {
        // const to = this.props.match.params.to.toUpperCase();
        // const from = this.props.match.params.from.toUpperCase();
        return (
            <div>
                {/* SPLASH PAGE {to} {from} */}
                <img className="splash-page-background" src={bg} alt="" />
            </div>
        )
    }
}