import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./components/App";
import "../index.css";
// importing our store
import configureStore from "./redux/configureStore";
import { Provider as ReduxProvider } from "react-redux";

// it can be useful to pass initial state into the store here if u are server re-rendering
// or initializing your redux store with data from local storage.
// passing a initial state here is merely for overwriting the default state that we pass in the reducer
const store = configureStore();

render(
  // provides react components access to the store passed via prop
  <ReduxProvider store={store}>
    <Router>
      <App />
    </Router>
  </ReduxProvider>,
  document.getElementById("app")
);
