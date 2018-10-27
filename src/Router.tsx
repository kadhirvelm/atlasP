import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { AtlasP } from "./AtlasP";
import { SplashPage } from "./SplashPage/Splash";

export class Router extends React.PureComponent {
    public render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/welcome/:to/:from" component={SplashPage} />
                    <Route component={AtlasP} />
                </Switch>
            </BrowserRouter>
        )
    }
}