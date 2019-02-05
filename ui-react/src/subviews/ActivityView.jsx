
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

    render() {

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
                                            <span className="card-label"> Schedule for Today </span>
                                        </div>
                                        <div className="card-content">
                                                <Row>
                                                    <Col lg={6}>
                                                        <h4 className="card-content-title">Findings</h4> The patient has great vital statistics. He is currently tagged as very healthy. <br/><br/>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <h4 className="card-content-title">Medications</h4> Biogesic <br/><br/>
                                                    </Col>
                                                </Row>
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
                                        <ActivityFeedItem selectedPatient={this.props.selectedPatient} />
                                        <ActivityFeedItem selectedPatient={this.props.selectedPatient} />
                                        <ActivityFeedItem selectedPatient={this.props.selectedPatient} />
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
