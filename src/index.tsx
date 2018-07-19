import * as _ from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

// tslint:disable-next-line:no-submodule-imports
import "@blueprintjs/core/lib/css/blueprint.css";
// tslint:disable-next-line:no-submodule-imports
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
// tslint:disable-next-line:no-submodule-imports
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import { App } from "./App";
import registerServiceWorker from "./registerServiceWorker";
import configureStore from "./State/Store";
import { loadState, saveState } from "./State/StoreCache";

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
