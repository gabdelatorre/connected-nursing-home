import React, { Component } from "react";
import { FormControl, Col, Row, Button, Grid, Glyphicon, MenuItem, Dropdown} from "react-bootstrap";
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
        
        this.state = { 
            currentView: "PROFILE",
            hovering: false,
        };
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

    goBack (view) {
        if (view === "EMPLOYEE_DASHBOARD") {
            this.props.closePatientDashboardView();
        }
        else {
            this.switchDashboardView(view);
        }
    }

    switchDashboardView (view) {
        console.log("View: " + view);
        this.setState({
            currentView: view
        })
    }

    onPatientSettingsSelect(evt) {
        if (evt === "remove") {
            this.props.removePatient();
        }
    }

    render() {

        const employeeDashboardProps = {
            selectedPatient: this.props.selectedPatient,
            selectedPatientVitalStats: this.props.selectedPatientVitalStats,
            switchDashboardView: this.switchDashboardView.bind(this),
        }

        var heartAnimation = {
            animation: 'anim-heart-beat ' + 60/parseFloat(this.props.selectedPatientVitalStats.HeartRate) + 's infinite'
        }

        var pdViewComponent = ()=>{
            if (this.state.currentView === "PROFILE") {
                console.log("CURRENT VIEW IS PROFILE")
                return (
                    <Col lg={9}>
                        <Row>
                              <Col lg={4}>
                                  <div className="health-stats-card">
                                      <span className="health-stats-label">Heart Rate</span><br/>
                                      <div>
                                          <div className="stats-segment-1"><p className="heartrate-bpm">{this.props.selectedPatientVitalStats.HeartRate}</p></div>
                                          <div className="stats-segment-2">
                                              <p className="heartrate-bpm-label">BPM</p>
                                              <Glyphicon glyph="heart" className="heart-glyph" style={heartAnimation}/>
                                          </div>
                                          <div className="stats-last-update">
                                              <p className="lastupdate"> <b>Last Update: </b> &nbsp; {moment(this.props.selectedPatientVitalStats.timestamp).format("lll")} </p>
                                          </div>
                                      </div>
                                  </div>
                              </Col>
                              <Col lg={4}>
                                  <div className="health-stats-card">
                                      <span className="health-stats-label">Temperature</span><br/>
                                      <div>
                                          <div className="stats-segment-1"><p className="heartrate-bpm">{this.props.selectedPatientVitalStats.temperature}</p></div>
                                          <div className="stats-segment-3">
                                              <p className="heartrate-bpm-label">°C</p>
                                          </div>
                                          <div className="stats-last-update">
                                              <p className="lastupdate"> <b>Last Update: </b> &nbsp; {} </p>
                                          </div>
                                      </div>
                                  </div>
                              </Col>
                              <Col lg={4}>
                                  <div className="health-stats-card">
                                      <span className="health-stats-label">Blood Pressure</span><br/>
                                      <div>
                                          <div className="stats-segment-1"><p className="heartrate-bpm">{this.props.selectedPatientVitalStats.BloodPressure}</p></div>
                                          <div className="stats-segment-2">
                                              <p className="heartrate-bpm-label">mmHg</p>
                                              <Glyphicon glyph="tint" className="bp-glyph"/>
                                          </div>
                                          <div className="stats-last-update">
                                              <p className="lastupdate"> <b>Last Update: </b> &nbsp; {moment(this.props.selectedPatientVitalStats.timestamp).format("lll")} </p>
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
                                                  <h4 className="card-content-title">Gender</h4> Male <br/><br/>
                                                  <h4 className="card-content-title">Birthday</h4> {this.props.selectedPatient.birthdate}<br/><br/>
                                              </Col>
                                              <Col lg={6}>
                                                  <h4 className="card-content-title">Height</h4> {this.props.selectedPatientVitalStats.height}<br/><br/>
                                                  <h4 className="card-content-title">Weight</h4> {this.props.selectedPatientVitalStats.weight}<br/><br/>
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
                                          <span className="patient-profile-label">Activity Feed</span>
                                      </div>
                                      <div className="activity-feed">
                                            <ActivityFeedItem {...employeeDashboardProps}/>
                                            <ActivityFeedItem {...employeeDashboardProps}/>
                                            <ActivityFeedItem {...employeeDashboardProps}/>
                                      </div>
                                  </div>
                                  </div>
                              </Col>
                          </Row>
                    </Col>
                )
            }

            else if (this.state.currentView === "HEALTH_RECORDS") {
                return (
                    <Col lg={9}>
                        <HealthRecordsView {...employeeDashboardProps} heartAnimation={heartAnimation}/>
                    </Col>
                )
            }

            else if (this.state.currentView === "ACTIVITY") {
                return null;
            }

            else {
                return null;
            }
        }

        return (
            <div className="patient-data-dashboard-view">
                <div className="breadcrumbs-view">
                    <h3 className="breadcrumbs"> 
                        <span className="clickable-bread" onClick={this.goBack.bind(this, "EMPLOYEE_DASHBOARD")}> My Dashboard </span> &nbsp; 
                        > &nbsp; 
                        Patient </h3>
                </div>
                <Grid fluid>
                    <Row>
                        <Col lg={3}>
                            <div className="patient-pic-card">
                                <div className="options-section">

                                    <Dropdown id="dropdown-custom-1" className="patient-option-btn" onSelect={this.onPatientSettingsSelect.bind(this)}>
                                        <Dropdown.Toggle noCaret className="patient-option-btn" >
                                        <Glyphicon glyph="option-vertical"/>
                                        </Dropdown.Toggle>
                                        {this.props.buttonRole}
                                    </Dropdown>

                                </div>
                                <div className="patient-pic-section">
                                    <img src={samplepic} className="profilepic"/>
                                </div>
                                <div className="patient-name-section">
                                    {this.props.selectedPatient.firstName + " " + this.props.selectedPatient.lastName}
                                </div>
                                <div className="patient-pic-btns">
                                    <Button className={"profile-action-btn " + (this.state.currentView === "PROFILE" ? "profile-action-btn-active" : "")} onClick={this.switchDashboardView.bind(this, "PROFILE")}> Profile </Button><br/>
                                    <Button className={"profile-action-btn " + (this.state.currentView === "HEALTH_RECORDS" ? "profile-action-btn-active" : "")} onClick={this.switchDashboardView.bind(this, "HEALTH_RECORDS")}> Health Records </Button><br/>
                                    <Button className={"profile-action-btn " + (this.state.currentView === "ACTIVITY" ? "profile-action-btn-active" : "")}  onClick={this.switchDashboardView.bind(this, "ACTIVITY")}> Activities </Button>
                                </div>
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
