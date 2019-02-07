
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

class ActivityView extends Component {

    constructor() {
        super();
        this.state = {
            selectedHealthStatGraph: "Heart Rate",
            showHealthExaminationForm: false,
            showHealthExaminationRecord: false,
            patientHealthExaminationRecords: [ // HARDCODED
                {
                    timestamps: "1/22/2019",
                    nurseId: "TBD",
                    temperature: "37.1",
                    bloodPressure: "122/70",
                    heartRate: "81",
                    medications: "Ambroxol",
                    remarks: "Patient is suffering from Upper Respiratory Tract Infection.",
                },
                {
                    timestamps: "1/29/2019",
                    nurseId: "TBD",
                    temperature: "37.8",
                    bloodPressure: "120/70",
                    heartRate: "78",
                    medications: "None",
                    remarks: "Patient is now healthy.",
                },
            ],
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

    render() {

        var tempActivityMap = this.props.tempSelectedPatientActivities.map((activity) => {
            return (
                <ActivityFeedItem selectedPatient={this.props.selectedPatient} activity={activity}/>
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
                                            ???
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
