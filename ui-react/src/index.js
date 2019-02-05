import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import App from "./containers/App.jsx";
import Firebase, { FirebaseContext } from "./firebase";

import "./assets/sass/styles.css";

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <BrowserRouter>
      <Switch>
        <Route path="/" name="Home" component={App} />
      </Switch>
    </BrowserRouter>
  </FirebaseContext.Provider>,
  document.getElementById("root")
);
