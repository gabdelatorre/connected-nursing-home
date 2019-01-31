import React, { Component } from "react";
import { FormControl, Col, Row, Button, Grid } from "react-bootstrap";
import { withFirebase } from "./../firebase/context";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import appRoutes from "../routes/appRoutes";

class PatientDashboard extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   data: null
    // };
    // this.setState({
    //   data: this.props.location.state.data
    // });
  }

  render() {
    return (
      <div className="PatientDashboard">
        <h3>Patient Dashboard</h3>
        {/* <h3> {this.props.location.state.data} </h3> */}
      </div>
    );
  }
}

export default withFirebase(PatientDashboard);
