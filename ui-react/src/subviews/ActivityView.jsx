
import moment from 'moment';
import React, { Component, optionsState } from "react";
import { FirebaseContext } from "../firebase";
import { withFirebase } from "../firebase/context";
import { Grid, Row, Col, Glyphicon } from "react-bootstrap";
import samplepic from "../assets/images/sample-patient.jpg";

import PatientCard from "./PatientCard";
import {
  FormGroup,
  InputGroup,
  FormControl,
  ControlLabel,
  Button
} from "react-bootstrap";
import ActivityFeedItem from "./ActivityFeedItem";
import ActivityPlannedItem from './ActivityPlannedItem';

class ActivityView extends Component {

    constructor() {
        super();
        this.state = {
            selectedHealthStatGraph: "Heart Rate",
            showHealthExaminationForm: false,
            showHealthExaminationRecord: false,
            selectedHealthExaminationRecord: null
        };
    }

    componentDidMount() {
        console.log("ActivityView: componentDidMount");
        console.log(this.props.selectedPatient);
    }

    goBack () {
        this.props.switchDashboardView("DASHBOARD")
    }

    toggleHealthExaminationForm () {

        if (this.state.showHealthExaminationForm) {
            this.setState({
                showHealthExaminationForm: false
            })
        }
        else {
            this.setState({
                showHealthExaminationForm: true
            })
        }
    }

    setHealthStatGraph (healthstat) {
        this.setState({
            selectedHealthStatGraph: healthstat
        })
    }

    toggleHealthExaminationRecord (record) {

        if (this.state.showHealthExaminationRecord) {
            this.setState({
                showHealthExaminationRecord: false,
                selectedHealthExaminationRecord: null,
            })
        }
        else {
            this.setState({
                showHealthExaminationRecord: true,
                selectedHealthExaminationRecord: record,
            })
        }
    }

    addActivity(){
        var activityDate = this.getVal("activityDate");
        var activityName = this.getVal("activityName");
        var activityDesc = this.getVal("activityDesc");
        var patientId = this.getVal("patientId");
        this.props.firebase.db.collection("patients").doc(patientId).collection("activity").add({
            "status": "In Progress",
            "activityDate": activityDate,
            "activityName": activityName,
            "activityDesc": activityDesc
        }).then(
            console.log("Successful")
        )
    }

    setActivityAction (action) {
        console.log(action);
    }

    render() {

        var tempActivityMap = this.props.tempSelectedPatientActivities.map((activity) => {
            return (
                <ActivityFeedItem selectedPatient={this.props.selectedPatient} activity={activity}/>
            )
        })

        var tempPlannedActivityMap = this.props.tempSelectedPatientActivities.map((activity) => {
            return (
                <div className="activity-block">
                <ActivityPlannedItem selectedPatient={this.props.selectedPatient} activity={activity} setAction={this.setActivityAction.bind(this)}/>
                </div>
            )
        })
        
        return (
            <div className="health-records-view">
                <Grid fluid className="nopads">
                    <Row>
                        <Col lg={12}>
                            <Row>
                                <Col lg={6}>
                                    <div>
                                    <div className="health-conditions-card">
                                        <div className="card-header">
                                            <span className="card-label"> Planned Activities </span>
                                        </div>
                                        <div className="card-content">
                                            {tempPlannedActivityMap}
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
                                            {tempActivityMap}
                                          </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </Grid>
            </div>
        );
    }
}

export default withFirebase(ActivityView);
