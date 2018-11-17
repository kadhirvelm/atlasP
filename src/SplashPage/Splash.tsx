import classNames from "classnames";
import * as React from "react";

import { Button, Intent } from "@blueprintjs/core";

import "../Components/Login/Login.scss";
import "./Splash.scss";

import image from "./daniel-leone.jpg";

export interface IMatchParams {
  match: {
    params: {
      to: string;
      from: string;
    };
  };
}

export class SplashPage extends React.PureComponent<IMatchParams> {
  public render() {
    const to = this.convertNametoUppercasing(this.props.match.params.to);
    const from = this.convertNametoUppercasing(this.props.match.params.from);
    return (
      <div>
        <div className="splash-main-page">
          <h1 className="splash-header">Welcome {to}</h1>
          <div className="splash-contents">
            <h4 className="splash-subheader">
              Join your friend, {from}, on AtlasP
            </h4>
            <div className="splash-main-content">
              <div className="splash-bullet border-right">
                <div className="splash-bullet-header">
                  Understand your social time.
                </div>
                <div className="splash-bullet-text">
                  AtlasGraph – relationship visualization.
                </div>
              </div>
              <div className="splash-bullet">
                <div className="splash-bullet-header">
                  Keep in touch with friends.
                </div>
                <div className="splash-bullet-text">
                  AtlasText – weekly recommendations.
                </div>
              </div>
            </div>
            <div className="claim-button">
              <Button
                intent={Intent.PRIMARY}
                large={true}
                onClick={this.moveToMainPage}
                text="Claim your account"
              />
            </div>
          </div>
        </div>
        <div className={classNames("filter", "white-filter")} />
        <div className={classNames("filter", "black-filter")} />
        <img className="login-page-background" src={image} alt="" />
        <div className="splash-credit">
          Photo by{" "}
          <a
            style={{ color: "white" }}
            target="_blank"
            href="https://unsplash.com/@danielleone"
          >
            Daniel Leone
          </a>{" "}
          on Unsplash
        </div>
      </div>
    );
  }

  private moveToMainPage = () => (window.location.href = "/");

  private convertNametoUppercasing(name: string) {
    return name.substr(0, 1).toUpperCase() + name.substr(1).toLowerCase();
  }
}
