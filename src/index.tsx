import * as _ from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import { App } from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { loadState, saveState } from "./State/LocalStorage";
import configureStore from "./State/Store";

const store = configureStore(loadState());

store.subscribe(
  _.throttle(() => {
    saveState(store.getState());
  }, 1000),
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement,
);
registerServiceWorker();
