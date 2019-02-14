import React, { Component } from "react";
import {
  FormControl,
  Col,
  Row,
  Button,
  Grid,
  Glyphicon,
  Dropdown,
  DropdownButton,
  MenuItem,
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
import RelativeView from "../subviews/RelativeView";
import VisitationView from "../subviews/VisitationView";
import PatientForm from "../subviews/PatientForm";
import ConfirmModal from "../subviews/ConfirmationModal";

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
      currentView: "PROFILE",
      statsHistoryForGraph: [],
      patientWearableStats: [],
      patientHealthExaminationRecords: [],
      activityFeed: [],
      plannedActivities: [],
      nextActivity: "",
      arrayOfVisitors: [],
      showPatientForm: false,
      showConfirm: false
    };

  }

  componentDidMount() {
      this.getPatientHealthStatsFromWearable();
      this.getPatientHealthRecord();
      this.getActivities();
      this.getPatientVisitors();
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

  getPatientHealthStatsFromWearable() {
    this.props.firebase.db
      .collection("patients")
      .doc(this.props.selectedPatient.id)
      .collection("wearable")
      .onSnapshot(e => {
        e.docs.forEach(e => {
          console.log("========== WEARABLES SNAPSHOT ==========");
          console.log(this.props.selectedPatient);
          console.log(e.data());

          var tempFirestoreHeartRateData = e.data().history.slice(Math.max(e.data().history.length - 5, 1))
          var tempHealthStatsData = [];

          tempFirestoreHeartRateData.forEach((data) => {
            var tempObj = {
              heartRate: data.state.reported.HeartRate,
              bloodPressure: data.state.reported.BloodPressure,
              timestamp: this.timestampFormatter(data.state.reported.timestamp),
            }

            tempHealthStatsData.push(tempObj);
          });

          console.log(tempHealthStatsData);

          this.setState({
            patientWearableStats:tempHealthStatsData,
          }, () => this.healthStatsSort());

        });
      });
  }

  getPatientHealthRecord() {
    this.props.firebase.db
      .collection("patients")
      .doc(this.props.selectedPatient.id)
      .collection("health_records")
      .orderBy("timestamp", "desc")
      .onSnapshot(e=>{
          this.setState({
            patientHealthExaminationRecords: []
          })

          e.docs.forEach(e=>{
              console.log(e.data())
              var tempTimestamp = e.data().timestamp.toDate();

              var dateTimestamp = this.timestampFormatter(tempTimestamp);

              this.setState({
                patientHealthExaminationRecords: this.state.patientHealthExaminationRecords.concat([
                  {
                    timestamp:  dateTimestamp,
                    nurseId:  e.data().uid,
                    nurseInCharge: e.data().nurseInCharge,
                    temperature: e.data().temperature,
                    bloodPressure: e.data().bloodPressure,
                    heartRate: e.data().heartRate,
                    medications: e.data().medications,
                    remarks: e.data().remarks,
                    height: e.data().height,
                    weight: e.data().weight,
                    id: e.id,
                  }
                ])
              })
          })

          this.healthStatsSort();
      })
  }

  getPatientVisitors() {

    var patientId = this.props.selectedPatient.id;
    this.props.firebase.db.collection("patients").doc(patientId).collection("visitor_logs").orderBy("dateCreated", "desc").onSnapshot(e =>{
      this.setState({
        arrayOfVisitors: []
      });
        e.docs.forEach(e =>{
          var tempTimestamp = e.data().dateCreated.toDate();

          var dateTimestamp = this.timestampFormatter(tempTimestamp);
          this.setState ({
            arrayOfVisitors: this.state.arrayOfVisitors.concat({
              visitorName: e.data().visitorName,
              visitorEmail: e.data().visitorEmail,
              visitationDate: e.data().visitationDate,
              status: e.data().status,
              dateCreated: dateTimestamp,
              id: e.id,
              remarks: e.data().remarks
            })
          })
          })
        })
  }

  timestampFormatter(timestamp) {
    var newDate = new Date(timestamp);

    return [newDate.getMonth()+1, newDate.getDate(), newDate.getFullYear()].join('/')+ ' ' +
              [newDate.getHours(), newDate.getMinutes(), newDate.getSeconds()].join(':');
  }

  getActivities() {
    this.props.firebase.db
    .collection("patients")
    .doc(this.props.selectedPatient.id)
    .collection("activity")
    .onSnapshot(e => {
        var tempActivityFeed = [];
        var tempPlannedActivity = [];
        var tempActivity = {}

        e.docs.forEach(e => {
          tempActivity = {
            "data": e.data(),
            "id": e.id,
            "patientId": this.props.selectedPatient.id
          }
            if (e.data().status === "Completed") {
                tempActivityFeed.push(tempActivity)
            } else {
                tempPlannedActivity.push(tempActivity)
            }
        });
        console.log(tempActivityFeed);
        tempActivityFeed.sort((a, b)=>{
            var keyA = new Date(a.data.activityDateCompleted.seconds),
                keyB = new Date(b.data.activityDateCompleted.seconds);
            // Compare the 2 dates
            if(keyA < keyB) return 1;
            if(keyA > keyB) return -1;
            return 0;
        });

        tempPlannedActivity.sort((a, b)=>{
          var keyA = new Date(a.data.activityDate.seconds),
              keyB = new Date(b.data.activityDate.seconds);
            // Compare the 2 dates
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
        });

        this.setState({
            activityFeed:tempActivityFeed,
            plannedActivities:tempPlannedActivity
        })
    });
  }

  healthStatsSort() {
    console.log("healthStatsSorts");
    var tempWearableStatsSort = this.state.patientWearableStats.slice();
    var tempHealthRecordsStatsSort = this.state.patientHealthExaminationRecords.slice();

    var combinedStats = tempWearableStatsSort.concat(tempHealthRecordsStatsSort);

    console.log(tempWearableStatsSort);
    console.log(tempHealthRecordsStatsSort);
    console.log(combinedStats);

    combinedStats.sort((a, b)=>{
      var keyA = new Date(a.timestamp),
          keyB = new Date(b.timestamp);
      // Compare the 2 dates
      if(keyA < keyB) return 1;
      if(keyA > keyB) return -1;
      return 0;
    });

    console.log(combinedStats);

    //var lastFiveStats = combinedStats.slice(Math.max(combinedStats.length - 5, 1))

    this.setState({statsHistoryForGraph:combinedStats})
  }

  togglePatientForm () {

    if (this.state.showPatientForm) {
        this.setState({
            showPatientForm: false
        })
    }
    else {
        this.setState({
            showPatientForm: true
        })
    }
  }

  toggleConfirm(status) {
    if(status){
      this.setState({showConfirm:status});
    } else {
      this.setState({showConfirm:!this.state.showConfirm});
    }
  }

  getConfimAction(action) {
    switch (action) {
      case "CONFIRMED":
        deletePatient(this.props.selectedPatient.id, this.props.firebase.db, () =>
        {
          //Do something after delete from firestore DB
          this.goBack("EMPLOYEE_DASHBOARD");
        });
        break;
      default:
        this.toggleConfirm(false);
    }
    this.toggleConfirm(false);
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
            <br />
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
              Nurses{" "}
            </Button>
            <br />
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
              Relatives{" "}
            </Button>
            <Button
              className={
                "profile-action-btn " +
                (this.state.currentView === "VISITATION_VIEW"
                  ? "profile-action-btn-active"
                  : "")
              }
              onClick={this.switchDashboardView.bind(this, "VISITATION_VIEW")}
            >
              {" "}
              Visitation{" "}
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
            <br />
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
              Relatives{" "}
            </Button>
            <Button
              className={
                "profile-action-btn " +
                (this.state.currentView === "VISITATION_VIEW"
                  ? "profile-action-btn-active"
                  : "")
              }
              onClick={this.switchDashboardView.bind(this, "VISITATION_VIEW")}
            >
              {" "}
              Visitation{" "}
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
            <br />
            <Button
              className={
                "profile-action-btn " +
                (this.state.currentView === "LIST_OF_NURSE_ASSIGNED"
                  ? "profile-action-btn-active"
                  : "")
              }
              onClick={this.switchDashboardView.bind(
                this,
                "LIST_OF_NURSE_ASSIGNED",
              )}
            >
              {" "}
              Nurses{" "}
            </Button>
            <Button
              className={
                "profile-action-btn " +
                (this.state.currentView === "VISITATION_VIEW"
                  ? "profile-action-btn-active"
                  : "")
              }
              onClick={this.switchDashboardView.bind(this, "VISITATION_VIEW")}
            >
              {" "}
              Visitation{" "}
            </Button>
          </div>
        );
      }
    };

    const employeeDashboardProps = {
      selectedPatient: this.props.selectedPatient,
      selectedPatientVitalStats: this.props.selectedPatientVitalStats,
      switchDashboardView: this.switchDashboardView.bind(this),
      userRole: this.props.userRole,

    };

    const moreDtlsBtn = () => {
      var userRole = this.props.userRole;
      if(userRole != "Relative") {
        return (
          <Dropdown id="dropdown-custom-1">
            <Dropdown.Toggle noCaret className="patient-option-btn">
              <Glyphicon glyph="option-vertical" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="super-colors">
              <MenuItem
                eventKey="1"
                onClick={this.togglePatientForm.bind(this)}
                >
                Edit
              </MenuItem>
              <MenuItem
                eventKey="2"
                onClick={this.toggleConfirm.bind(this)}
                >
                  Delete
              </MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        )
      }
      return (null);
    }

    console.log(this.props.selectedPatientVitalStats);

    var heartAnimation = {
      animation:
        "anim-heart-beat " +
        60 / parseFloat(this.props.selectedPatientVitalStats.heartRate) +
        "s infinite"
    };

    var tempActivityMap = this.state.activityFeed.map((activity) => {
        return (
            <ActivityFeedItem {...employeeDashboardProps} activity={activity}/>
        )
    })

    var nextActivity = "";
    if (this.state.plannedActivities.length != 0) {
        nextActivity = this.state.plannedActivities[0]
    }

    var pdViewComponent = () => {
      if (this.state.currentView === "PROFILE") {
        console.log("CURRENT VIEW IS PROFILE");
        return (
          <Col lg={9} md={9} sm={12} xs={12}>
            <Row>
              <Col lg={8} md={8} sm={8} xs={12}>
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
                        </Col>
                        <Col lg={6}>
                          <h4 className="card-content-title">Height</h4>{" "}
                          {this.props.selectedPatientVitalStats.height}
                          <br />
                          <br />
                          <h4 className="card-content-title">Weight</h4>{" "}
                          {this.props.selectedPatientVitalStats.weight}
                        </Col>
                      </Row>
                    </div>
                  </div>

                  <div className="patient-nextact-card">
                    <div className="card-header">
                        <div className="card-label">Up Next</div>
                    </div>
                    <div className="card-content">
                    {
                        nextActivity !== ""
                        ?
                        <div className="upnext-content">
                            <Col lg={3} md={3} sm={3} xs={3}>
                                <p className="upnextdate">{moment.unix(nextActivity.data.activityDate.seconds)
                                .format("ddd, h:mmA")}
                                </p>
                            </Col>
                            <Col lg={9} md={9} sm={9} xs={9}>
                                <p><b>{this.props.selectedPatient.firstName}</b>'s next activity is &nbsp; <b>{nextActivity.data.activityName}</b>.</p>
                            </Col>
                        </div>
                        :
                        <p><b>{this.props.selectedPatient.firstName}</b> has no upcoming planned activity. </p>
                    }
                    </div>
                  </div>

                  <div className="patient-profile-card">
                    <div className="card-header">
                      <span className="patient-profile-label">
                        Activity Feed
                      </span>
                    </div>
                    <div className="activity-feed">
                      {tempActivityMap}
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={4} md={4} sm={4} xs={12}>
                <Col lg={12} md={12} sm={12} xs={12} className="nopads">
                  <div className="health-stats-card">
                    <span className="health-stats-label">Heart Rate</span>
                    <br />
                    <div>
                      <div className="stats-segment-1">
                        <p className="heartrate-bpm">
                          {this.props.selectedPatientVitalStats.heartRate}
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
                          {moment(
                              this.props.selectedPatientVitalStats.timestamp
                            )
                            .format("lll")}{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={12} md={12} sm={12} xs={12} className="nopads">
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
                <Col lg={12} md={12} sm={12} xs={12} className="nopads">
                  <div className="health-stats-card">
                    <span className="health-stats-label">Blood Pressure</span>
                    <br />
                    <div>
                      <div className="stats-segment-1">
                        <p className="heartrate-bpm">
                          {this.props.selectedPatientVitalStats.bloodPressure}
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
                          {moment(
                              this.props.selectedPatientVitalStats.timestamp
                            )
                            .format("lll")}{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>
              </Col>
            </Row>
          </Col>
        );
      } else if (this.state.currentView === "HEALTH_RECORDS") {
        return (
            <Col lg={9} md={9} sm={12} xs={12}>
                <HealthRecordsView
                  {...employeeDashboardProps}
                  heartAnimation={heartAnimation}
                  selectedPatientStatsHistoryForGraph={this.state.statsHistoryForGraph}
                  selectedPatientHealthExamRecords={this.state.patientHealthExaminationRecords}
                  authUser = {this.props.authUser}
                  userData = {this.props.userData}
                />
            </Col>
        );
      } else if (this.state.currentView === "ACTIVITY") {
        return (
            <Col lg={9} md={9} sm={12} xs={12}>
                <ActivityView
                  {...employeeDashboardProps}
                  plannedActivities={this.state.plannedActivities}
                  activityFeed={this.state.activityFeed}
                />
            </Col>
        );
      } else if (this.state.currentView === "LIST_OF_NURSE_ASSIGNED") {
        return (
          <Col lg={9} md={9} sm={12} xs={12}>
            <NurseAssignedListOfAvailable selectedPatient={this.props.selectedPatient} userRole={this.props.userRole}/>
          </Col>
        );
      } else if (this.state.currentView === "LIST_OF_RELATIVES") {
        return (
          <Col lg={9} md={9} sm={12} xs={12}>
            <RelativeView selectedPatient={this.props.selectedPatient} userRole={this.props.userRole}/>
          </Col>
        );
      } else if (this.state.currentView === "VISITATION_VIEW") {
        return (
          <Col lg={9} md={9} sm={12} xs={12}>
            <VisitationView selectedPatient={this.props.selectedPatient} userRole={this.props.userRole} userData={this.props.userData} arrayOfVisitors={this.state.arrayOfVisitors}/>
          </Col>
        );
      } else {
        return null;
      }
    };

    return (
      <div className="patient-data-dashboard-view">
        <div className="header-section">
            <div className="header-s"><h3>Patient's Dashboard</h3></div>

            <div className="breadcrumbs-view">
              <h3 className="breadcrumbs">
                <span
                  className="clickable-bread"
                  onClick={this.goBack.bind(this, "EMPLOYEE_DASHBOARD")}
                >
                  {" "}
                  Home{" "}
                </span>{" "}
                &nbsp; > &nbsp; <b>Patient</b>{" "}
              </h3>
            </div>
        </div>
        <div className="view-content">
        <Grid fluid>
          <Row>
            <Col lg={3} md={3} sm={12} xs={12} >
              <div className="patient-pic-card">
                <div className="options-section pull-right">
                {moreDtlsBtn()}
                </div>
                <Grid fluid className="nopads">
                  <Row>
                    <Col lg={12} md={12} sm={6} xs={12}>
                      <div className="patient-pic-section">
                        <img src={samplepic} className="profilepic" />
                      </div>
                      <div className="patient-name-section">
                        {this.props.selectedPatient.firstName +
                          " " +
                          this.props.selectedPatient.lastName}
                      </div>
                    </Col>
                    <Col lg={12} md={12} sm={6} xs={12}>
                      {btnRole()}
                    </Col>
                  </Row>
                </Grid>

              </div>
            </Col>
            {pdViewComponent()}
          </Row>
        </Grid>
        </div>

        <PatientForm
            editPatient={this.props.selectedPatient}
            showPatientForm={this.state.showPatientForm}
            closePatientForm={this.togglePatientForm.bind(this)}
        />

        <ConfirmModal
            header={'Confirm Delete Patient'}
            message={'Are you sure you want to delete this patient?'}
            show={this.state.showConfirm}
            onHide={this.toggleConfirm.bind(this)}
            onAction={this.getConfimAction.bind(this)}
        />
      </div>
    );
  }
}

export default withFirebase(PatientDashboard);

function deletePatient(patientId, dbinstance, callback) {
  console.log("DELETING PATIENT: "+patientId);
  var patientsRef = dbinstance.collection("patients");

  //Delete sub collections of patients and relatives first first
  deleteSubCollection(dbinstance, `patients/${patientId}/nurse_Assigned`, 25);
  deleteSubCollection(dbinstance, `patients/${patientId}/relatives`, 25);

  //Finally delete document
  patientsRef
    .doc(patientId)
    .delete()
    .then(() => {
      callback();
    });
}

//Delete Collection and Delete query batch for removing documents and its
//subcollections as per firestore specifications
function deleteSubCollection(db, collectionPath, batchSize) {
     var collectionRef = db.collection(collectionPath);
     var query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
}

function deleteQueryBatch(db, query, batchSize, resolve, reject) {
query.get()
    .then((snapshot) => {
        // When there are no documents left, we are done
        if (snapshot.size == 0) {
            return 0;
        }

        // Delete documents in a batch
        var batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        return batch.commit().then(() => {
            return snapshot.size;
        });
    }).then((numDeleted) => {
        if (numDeleted === 0) {
            resolve();
            return;
        }

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
            deleteQueryBatch(db, query, batchSize, resolve, reject);
        });
    })
    .catch(reject);
}
