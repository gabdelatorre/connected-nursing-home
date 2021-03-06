import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Registration from "../views/Registration";
import Login from "./../views/Login";
import { withFirebase } from "./../firebase/context";
import EmployeeDashboard from "../views/EmployeeDashboard";
import RelativeDashboard from "../views/RelativeDashboard";
import NursingHomeDashboard from "../views/NursingHomeDashboard";
import Sidebar from "./../components/Sidebar";
import PatientDashboard from "../views/PatientDashboard";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null,
      userData: null,
      userDataLoaded: false
    };
  }

  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        console.log("onAuthStateChanged: hasUser");
        this.setState({ authUser });

        console.log(authUser);

        this.props.firebase.user(authUser.uid).onSnapshot(snapshot => {
          this.setState(
            {
              userData: snapshot.data(),
              userDataLoaded: true
            },
            () => {
              console.log(this.state.userData);

              if (this.state.userData.role == "ADMIN") {
                this.props.history.push("/nhdashboard");
              } else if (this.state.userData.role == "EMPLOYEE") {
                this.props.history.push("/edashboard");
              } else if (this.state.userData.role == "RELATIVE") {
                this.props.history.push("/rdashboard");
              }
            }
          );
        });
      } else {
        console.log("onAuthStateChanged: noUser");
        this.setState({ authUser: null });
        this.props.history.push("/login");
      }
    });
  }

  render() {
    // ==========================================================
    // == Routes for unauthenticated users
    // ==========================================================
    if (!this.state.authUser || !this.state.userDataLoaded) {
      return (
        <Switch>
          <Route
            path="/login"
            exact
            strict
            render={() => <Login authUser={this.state.authUser} />}
          />
          <Route
            path="/registration"
            exact
            strict
            render={() => <Registration authUser={this.state.authUser} />}
          />
        </Switch>
      );
    }
    // ==========================================================
    // == Routes for authenticated users
    // ==========================================================
    else {

      const userProps = {
        userData: this.state.userData,
        authUser: this.state.authUser
      }
      return (
        <div className="wrapper">
          {/* <Sidebar userData={this.state.userData} /> */}
          <div id="main-panel" className="main-panel">
            <Header {...userProps} />
            <Switch>
              <Route
                path="/edashboard"
                exact
                strict
                render={() => (
                  <EmployeeDashboard {...userProps} />
                )}
              />
              <Route
                path="/nhdashboard"
                exact
                strict
                render={() => (
                  <NursingHomeDashboard {...userProps} />
                )}
              />
              <Route
                path="/rdashboard"
                exact
                strict
                render={() => (
                  <RelativeDashboard {...userProps} />
                )}
              />
            </Switch>

            <Route
              path="/pdashboard"
              exact
              strict
              render={() => <PatientDashboard {...userProps} />}
            />
          </div>
        </div>
      );
    }
  }
}

export default withFirebase(App);
