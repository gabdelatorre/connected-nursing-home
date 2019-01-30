import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import App from "./containers/App.jsx";
import Firebase, { FirebaseContext } from "./firebase";

import "./assets/sass/styles.css";
import "./assets/sass/scss/_EmployeeDashboard.scss";
import "./assets/sass/scss/_RelativeDashboard.scss";
import "./assets/sass/scss/_NursingHomeDashboard.scss";
import "./assets/sass/scss/_patientCard.scss";

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
