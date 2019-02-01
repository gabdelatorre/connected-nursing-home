import React, { Component } from "react";
import { FormControl, Col, Row, Button, Grid } from "react-bootstrap";
import { withFirebase } from "./../firebase/context";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import appRoutes from "../routes/appRoutes";
import posed from "react-pose";

import styled from "styled-components";

const Ball = posed.div({
  visible: { opcaity: 1 },
  hidden: { opacity: 0 }
});

const Square = posed.div({
  idle: { scale: 1 },
  hovered: {
    scale: 1.3,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 0
    }
  }
});

const StyledSquare = styled(Square)`
  width: 100px;
  height: 100px;
  background: red;
`;

class PatientDashboard extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.data);
    alert(this.props.heartUpdate);

    this.state = { hovering: false };
  }

  componentWillReceiveProps() {
    // if (!this.state.hovering) {
    //   alert("Will");
    //   this.setState({
    //     hovering: true
    //   });
    // }
    // alert("it will update");
  }

  componentDidUpdate() {
    // alert("It did update");
    // var statess = this.state.hovering;
    // setTimeout(function() {
    //   alert("DIDUPDATE");
    //   if (statess) {
    //     this.setState({
    //       hovering: false
    //     });
    //   }
    // }, 2000);
  }

  render() {
    return (
      <div className="PatientDashboard">
        <div className="modalResponsive">
          <h2>
            <b>Profile of {this.props.selectedPatient.firstName}</b>
          </h2>
          <div className="containerModal">
            <div className="itemsModal pictureItem">
              <div className="containerModalPicture">
                <div className="itemsModal pictureItem">
                  <img src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" />
                </div>
              </div>
            </div>

            <div className="itemsModal">
              <div className="containerModalBody">
                <div className="itemsModal">
                  <p className="modalBodyText">
                    <b>First Name:</b>
                    {this.props.selectedPatient.firstName}{" "}
                  </p>
                </div>

                <div className="itemsModal">
                  <p className="modalBodyText">
                    <b>Last name:</b>
                    {this.props.selectedPatient.lastName}
                  </p>
                </div>

                <div className="itemsModal">
                  <p className="modalBodyText">
                    <b>Birthdate:</b>
                    {this.props.selectedPatient.birthdate}{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="containerVitalStatistic">
            <div className="itemsModal">
              <p className="modalBodyText">
                <b>Height:</b> {this.props.selectedPatientVitalStats.height}
              </p>
            </div>

            <div className="itemsModal">
              <p className="modalBodyText">
                <b>Weight:</b> {this.props.selectedPatientVitalStats.weight}
              </p>
            </div>

            <div className="itemsModal">
              <p className="modalBodyText">
                <b>Blood Pressure:</b>{" "}
                <input
                  type="text"
                  value={this.props.selectedPatientVitalStats.bloodPressure}
                />
              </p>
            </div>

            <div className="itemsModal">
              <p className="modalBodyText">
                <b>Temperature:</b>{" "}
                {this.props.selectedPatientVitalStats.temperature}
                {this.props.heartUpdate}
              </p>
            </div>

            <div className="itemsModal">
              <StyledSquare pose={this.state.hovering ? "hovered" : "idle"} />
              <p className="modalBodyText">
                <b>Heart Rate: </b>{" "}
                {this.props.selectedPatientVitalStats.heartRate}
              </p>
            </div>
          </div>
          <div className="containerModalButtons">{this.props.buttonRole}</div>
        </div>
      </div>
    );
  }
}

export default withFirebase(PatientDashboard);
