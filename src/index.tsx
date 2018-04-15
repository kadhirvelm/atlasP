import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from "react-redux";

import '@blueprintjs/core/lib/css/blueprint.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import configureStore from "./State/Store";

const configuredStore = configureStore();

ReactDOM.render(
  <Provider store={ configuredStore }>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
