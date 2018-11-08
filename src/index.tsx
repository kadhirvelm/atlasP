import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

// tslint:disable-next-line:no-submodule-imports
import "@blueprintjs/core/lib/css/blueprint.css";

import registerServiceWorker from "./registerServiceWorker";
import { Router } from "./Router";
import configureStore from "./State/Store";
import { loadState, saveState } from "./State/StoreCache";
import { throttle } from "./Utils/Util";

import "./index.scss";

const store = configureStore(loadState());

store.subscribe(
  throttle(() => {
    saveState(store.getState());
  }, 1000),
);

ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById("root") as HTMLElement,
);
registerServiceWorker();
