import React, { Component } from "react";
import {
  FormControl,
  Col,
  Row,
  Button,
  Grid,
  Glyphicon
} from "react-bootstrap";
import { withFirebase } from "./../firebase/context";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import appRoutes from "../routes/appRoutes";
import posed from "react-pose";
import samplepic from "../assets/images/sample-patient.jpg";

import styled from "styled-components";
import HealthRecordsView from "../subviews/HealthRecordsView";
import HealthRecordsHistory from "../subviews/HealthRecordsHistory";
import moment from "moment";
import ActivityFeedItem from "../subviews/ActivityFeedItem";
import NurseAssignedListOfAvailable from "../subviews/NurseAssignedListOfAvailable";
import ActivityView from "../subviews/ActivityView";

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
    this.state = {
      currentView: "PROFILE"
    };
  }

  goBack(view) {
    if (view === "EMPLOYEE_DASHBOARD") {
      this.props.closePatientDashboardView();
    } else {
      this.switchDashboardView(view);
    }
  }

  switchDashboardView(view) {
    console.log("View: " + view);
    this.setState({
      currentView: view
    });
  }

  populateListOfRelatives() {
    var patientId = this.props.selectedPatient.id;
    this.props.firebase.db
      .collection("patients")
      .doc(patientId)
      .collection("relatives")
      .onSnapshot(e => {
        e.docs.forEach(e => {
          console.log(e.data());
        });
      });
  }

  render() {
    const btnRole = () => {
      var userRole = this.props.userRole;
      if (userRole == "Admin") {
        return (
          <div className="patient-pic-btns">
            <Button
              className={
                "profile-action-btn " +
                (this.state.currentView === "PROFILE"
                  ? "profile-action-btn-active"
                  : "")
              }
              onClick={this.switchDashboardView.bind(this, "PROFILE")}
            >
              {" "}
              Profile{" "}
            </Button>
            <br />
            <Button
              className={
                "profile-action-btn " +
                (this.state.currentView === "HEALTH_RECORDS"
                  ? "profile-action-btn-active"
                  : "")
              }
              onClick={this.switchDashboardView.bind(this, "HEALTH_RECORDS")}
            >
              {" "}
              Health Records{" "}
            </Button>
            <br />
            <Button
              className={
                "profile-action-btn " +
                (this.state.currentView === "ACTIVITY"
                  ? "profile-action-btn-active"
                  : "")
              }
              onClick={this.switchDashboardView.bind(this, "ACTIVITY")}
            >
              {" "}
              Activities{" "}
            </Button>
            <Button
              className={
                "profile-action-btn " +
                (this.state.currentView === "LIST_OF_NURSE_ASSIGNED"
                  ? "profile-action-btn-active"
                  : "")
              }
              onClick={this.switchDashboardView.bind(
                this,
                "LIST_OF_NURSE_ASSIGNED"
              )}
            >
              {" "}
              Nurse Assigned{" "}
            </Button>
            <Button
              className={
                "profile-action-btn " +
                (this.state.currentView === "LIST_OF_RELATIVES"
                  ? "profile-action-btn-active"
                  : "")
              }
              onClick={this.switchDashboardView.bind(this, "LIST_OF_RELATIVES")}
            >
              {" "}
              List of Relatives{" "}
            </Button>
          </div>
        );
      } else if (userRole == "Employee") {
        return (
          <div className="patient-pic-btns">
            <Button
              className={
                "profile-action-btn " +
                (this.state.currentView === "PROFILE"
                  ? "profile-action-btn-active"
                  : "")
              }
              onClick={this.switchDashboardView.bind(this, "PROFILE")}
            >
              {" "}
              Profile{" "}
            </Button>
            <br />
            <Button
              className={
                "profile-action-btn " +
                (this.state.currentView === "HEALTH_RECORDS"
                  ? "profile-action-btn-active"
                  : "")
              }
              onClick={this.switchDashboardView.bind(this, "HEALTH_RECORDS")}
            >
              {" "}
              Health Records{" "}
            </Button>
            <br />
            <Button
              className={
                "profile-action-btn " +
                (this.state.currentView === "ACTIVITY"
                  ? "profile-action-btn-active"
                  : "")
              }
              onClick={this.switchDashboardView.bind(this, "ACTIVITY")}
            >
              {" "}
              Activities{" "}
            </Button>
          </div>
        );
      } else if (userRole == "Relative") {
        return (
          <div className="patient-pic-btns">
            <Button
              className={
                "profile-action-btn " +
                (this.state.currentView === "PROFILE"
                  ? "profile-action-btn-active"
                  : "")
              }
              onClick={this.switchDashboardView.bind(this, "PROFILE")}
            >
              {" "}
              Profile{" "}
            </Button>
            <br />
            <Button
              className={
                "profile-action-btn " +
                (this.state.currentView === "HEALTH_RECORDS"
                  ? "profile-action-btn-active"
                  : "")
              }
              onClick={this.switchDashboardView.bind(this, "HEALTH_RECORDS")}
            >
              {" "}
              Health Records{" "}
            </Button>
            <br />
            <Button
              className={
                "profile-action-btn " +
                (this.state.currentView === "ACTIVITY"
                  ? "profile-action-btn-active"
                  : "")
              }
              onClick={this.switchDashboardView.bind(this, "ACTIVITY")}
            >
              {" "}
              Activities{" "}
            </Button>
          </div>
        );
      }
    };

    const employeeDashboardProps = {
      selectedPatient: this.props.selectedPatient,
      selectedPatientVitalStats: this.props.selectedPatientVitalStats,
      switchDashboardView: this.switchDashboardView.bind(this)
    };

    var heartAnimation = {
      animation:
        "anim-heart-beat " +
        60 / parseFloat(this.props.selectedPatientVitalStats.HeartRate) +
        "s infinite"
    };

    var pdViewComponent = () => {
      if (this.state.currentView === "PROFILE") {
        console.log("CURRENT VIEW IS PROFILE");
        return (
          <Col lg={9}>
            <Row>
              <Col lg={4}>
                <div className="health-stats-card">
                  <span className="health-stats-label">Heart Rate</span>
                  <br />
                  <div>
                    <div className="stats-segment-1">
                      <p className="heartrate-bpm">
                        {this.props.selectedPatientVitalStats.HeartRate}
                      </p>
                    </div>
                    <div className="stats-segment-2">
                      <p className="heartrate-bpm-label">BPM</p>
                      <Glyphicon
                        glyph="heart"
                        className="heart-glyph"
                        style={heartAnimation}
                      />
                    </div>
                    <div className="stats-last-update">
                      <p className="lastupdate">
                        {" "}
                        <b>Last Update: </b> &nbsp;{" "}
                        {moment
                          .unix(
                            this.props.selectedPatientVitalStats.timestamp
                              .seconds
                          )
                          .format("lll")}{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={4}>
                <div className="health-stats-card">
                  <span className="health-stats-label">Temperature</span>
                  <br />
                  <div>
                    <div className="stats-segment-1">
                      <p className="heartrate-bpm">
                        {this.props.selectedPatientVitalStats.temperature}
                      </p>
                    </div>
                    <div className="stats-segment-3">
                      <p className="heartrate-bpm-label">°C</p>
                    </div>
                    <div className="stats-last-update">
                      <p className="lastupdate">
                        {" "}
                        <b>Last Update: </b> &nbsp; {}{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={4}>
                <div className="health-stats-card">
                  <span className="health-stats-label">Blood Pressure</span>
                  <br />
                  <div>
                    <div className="stats-segment-1">
                      <p className="heartrate-bpm">
                        {this.props.selectedPatientVitalStats.BloodPressure}
                      </p>
                    </div>
                    <div className="stats-segment-2">
                      <p className="heartrate-bpm-label">mmHg</p>
                      <Glyphicon glyph="tint" className="bp-glyph" />
                    </div>
                    <div className="stats-last-update">
                      <p className="lastupdate">
                        {" "}
                        <b>Last Update: </b> &nbsp;{" "}
                        {moment
                          .unix(
                            this.props.selectedPatientVitalStats.timestamp
                              .seconds
                          )
                          .format("lll")}{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <div>
                  <div className="patient-profile-card">
                    <div className="card-header">
                      <span className="patient-profile-label">Profile</span>
                    </div>
                    <div className="card-content">
                      <Row>
                        <Col lg={6}>
                          <h4 className="card-content-title">Gender</h4> Male{" "}
                          <br />
                          <br />
                          <h4 className="card-content-title">Birthday</h4>{" "}
                          {this.props.selectedPatient.birthdate}
                          <br />
                          <br />
                        </Col>
                        <Col lg={6}>
                          <h4 className="card-content-title">Height</h4>{" "}
                          {this.props.selectedPatientVitalStats.height}
                          <br />
                          <br />
                          <h4 className="card-content-title">Weight</h4>{" "}
                          {this.props.selectedPatientVitalStats.weight}
                          <br />
                          <br />
                        </Col>
                      </Row>
                      <h4 className="card-content-title">Address</h4> ?
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <div>
                  <div className="patient-profile-card">
                    <div className="card-header">
                      <span className="patient-profile-label">
                        Activity Feed
                      </span>
                    </div>
                    <div className="activity-feed">
                      <ActivityFeedItem {...employeeDashboardProps} />
                      <ActivityFeedItem {...employeeDashboardProps} />
                      <ActivityFeedItem {...employeeDashboardProps} />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        );
      } else if (this.state.currentView === "HEALTH_RECORDS") {
        return (
            <Col lg={9}>
                <HealthRecordsView
                  {...employeeDashboardProps}
                  heartAnimation={heartAnimation}
                />
            </Col>
        );
      } else if (this.state.currentView === "ACTIVITY") {
        return (
            <Col lg={9}>
                <ActivityView
                  {...employeeDashboardProps}
                />
            </Col>
        );
      } else if (this.state.currentView === "LIST_OF_NURSE_ASSIGNED") {
        return (
          <Col lg={9}>
            <NurseAssignedListOfAvailable />
          </Col>
        );
      } else if (this.state.currentView === "LIST_OF_RELATIVES") {
        return null;
      } else {
        return null;
      }
    };

    return (
      <div className="patient-data-dashboard-view">
        <div className="breadcrumbs-view">
          <h3 className="breadcrumbs">
            <span
              className="clickable-bread"
              onClick={this.goBack.bind(this, "EMPLOYEE_DASHBOARD")}
            >
              {" "}
              My Dashboard{" "}
            </span>{" "}
            &nbsp; > &nbsp; Patient{" "}
          </h3>
        </div>
        <Grid fluid>
          <Row>
            <Col lg={3}>
              <div className="patient-pic-card">
                <div className="options-section">
                  <Button className="patient-option-btn">
                    <Glyphicon glyph="option-vertical" />
                  </Button>
                </div>
                <div className="patient-pic-section">
                  <img src={samplepic} className="profilepic" />
                </div>
                <div className="patient-name-section">
                  {this.props.selectedPatient.firstName +
                    " " +
                    this.props.selectedPatient.lastName}
                </div>

                {btnRole()}
              </div>
            </Col>
            {pdViewComponent()}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default withFirebase(PatientDashboard);
