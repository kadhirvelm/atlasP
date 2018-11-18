import * as React from "react";

import { IIconProps } from "./icon";

export class NewPersonIcon extends React.PureComponent<IIconProps> {
  public render() {
    return (
      <svg
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 63 63"
        {...this.props.attributes}
      >
        <title>new_person</title>
        <path d="M48.52,35A13.48,13.48,0,1,0,62,48.44,13.47,13.47,0,0,0,48.52,35ZM56,50.39H50.47v5.52a1.95,1.95,0,0,1-3.89,0V50.39H41.06a1.95,1.95,0,0,1,0-3.89h5.52V41a1.95,1.95,0,1,1,3.89,0V46.5H56a1.95,1.95,0,0,1,0,3.89Z" />
        <path d="M17.64.57h5.51a9,9,0,0,1,9,9v8.72a11,11,0,0,1-11,11H19.63a11,11,0,0,1-11-11V9.54a9,9,0,0,1,9-9Z" />
        <path d="M30.81,48.44a17.62,17.62,0,0,1,5.34-12.65A12.72,12.72,0,0,0,27,31.85h-1.1a15.63,15.63,0,0,1-11,0h-1.1A12.77,12.77,0,0,0,1.08,44.59v15A88.13,88.13,0,0,0,20.4,61.72a89.66,89.66,0,0,0,15.12-1.28A17.67,17.67,0,0,1,30.81,48.44Z" />
      </svg>
    );
  }
}
