
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
import Modal from "react-responsive-modal";
import ButtonBase from "@material-ui/core/ButtonBase";
import HealthRecordsHistory from "./HealthRecordsHistory";
import HealthExaminationForm from './HealthExaminationForm';
import HealthExaminationRecord from './HealthExaminationRecord';
import LineChart from 'react-linechart';
import "../../node_modules/react-linechart/dist/styles.css";

class HealthRecordsView extends Component {

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
            selectedHealthExaminationRecord: null,
            heartRateHistory: [
                {									
                    color: "red", 
                    points: [{x: 1, y: 87}, {x: 2, y: 89}, {x: 3, y: 99}, {x: 4, y: 86}, {x: 5, y: 89}, {x: 6, y: 89}, {x: 7, y: 89}, {x: 8, y: 89}, {x: 9, y: 89}] 
                }
            ]
        };
    }

    componentDidMount() {
        console.log("HealthRecordsView: componentDidMount");
        console.log(this.props.selectedPatient);
    }

    searchCheckUp(){
        var patientId = "KEr41uK5SZOmwy5Fd1CZ";
        var date = document.querySelector('#dateTxt').value;
        var newDate = new Date(date);
        var finalDate = newDate.getMonth()+1 + "-" + newDate.getDate() + "-" + newDate.getFullYear();
        console.log(finalDate);

        this.props.firebase.db.collection("patients").doc(patientId).collection("vital_statistics").where("timestamps", "==", finalDate).get().then( data =>{
            data.docs.forEach(data=>{
                this.setVal("bloodPressure", data.data().bloodPressure);
                this.setVal("height", data.data().height);
                this.setVal("weight", data.data().weight);
                this.setVal("temperature", data.data().temperature);
                this.setVal("remarks", data.data().remarks);
            }) 
        });

        this.props.firebase.db.collection("patients").onSnapshot(e=>{
            e.docs.forEach(e=>{
                this.props.firebase.db.collection("patients").doc(e.id).collection("vital_statistics").where("timestamps", "==", finalDate).get().then( data =>{
                    data.docs.forEach(data=>{
                        console.log(data.data())
                    }) 
                });
            })
        })
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

        const data = [
		];

        return (
            <div className="health-records-view">
                <Grid fluid className="nopads">
                    <Row>
                        <Col lg={12}>
                            <Row>
                                <Col lg={12}>
                                    <div>
                                    <div className="health-conditions-card">
                                        <div className="card-header">
                                            <span className="card-label"> Latest Health Conditions </span>
                                        </div>
                                        <div className="card-content">
                                                <Row>
                                                    <Col lg={6}>
                                                        <h4 className="card-content-title">Findings</h4> {this.props.selectedPatientVitalStats.remarks} <br/><br/>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <h4 className="card-content-title">Medications</h4> {this.props.selectedPatientVitalStats.medications} <br/><br/>
                                                    </Col>
                                                </Row>
                                        </div>
                                    </div>
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col lg={8}>
                                    <div>
                                    <div className="health-stats-graph-card">
                                        <div className="card-header">
                                            <span className="health-stats-graph-label"> {this.state.selectedHealthStatGraph + " Graph"}</span>
                                        </div>
                                        <div className="card-content">
                                            <p className="">
                                            </p>
                                            <LineChart 
					                        	width={600}
					                        	height={400}
                                                data={this.state.heartRateHistory}
                                                xLabel="Instance"
                                                yLabel="Heart Rate"
					                        />
                                        </div>
                                    </div>
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <Col lg={12} md={12} sm={4} xs={4}>
                                    <div 
                                        className={"health-stats-card clickable-heart-health-stat " + (this.state.selectedHealthStatGraph === "Heart Rate" ? "clickable-heart-health-stat-active" : "")}
                                        onClick={this.setHealthStatGraph.bind(this, "Heart Rate")}
                                    >
                                        <span className="health-stats-label">Heart Rate</span><br/>
                                        <div>
                                            <div className="stats-segment-1"><p className="heartrate-bpm">{this.props.selectedPatientVitalStats.heartRate}</p></div>
                                            <div className="stats-segment-2">
                                                <p className="heartrate-bpm-label">BPM</p>
                                                <Glyphicon glyph="heart" className="heart-glyph" style={this.props.heartAnimation}/>
                                            </div>
                                            <div className="stats-last-update">
                                                <p className="lastupdate"> <b>Last Update: </b> &nbsp; {moment(this.props.selectedPatientVitalStats.timestamp.seconds).format("lll")} </p>
                                            </div>
                                        </div>
                                    </div>
                                    </Col>
                                    <Col lg={12} md={12} sm={4} xs={4}>
                                    <div 
                                        className={"health-stats-card clickable-temp-health-stat " + (this.state.selectedHealthStatGraph === "Temperature" ? "clickable-temp-health-stat-active" : "")}
                                        onClick={this.setHealthStatGraph.bind(this, "Temperature")}
                                    >
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
                                    <Col lg={12} md={12} sm={4} xs={4}>
                                    <div 
                                        className={"health-stats-card clickable-bp-health-stat " + (this.state.selectedHealthStatGraph === "Blood Pressure" ? "clickable-bp-health-stat-active" : "")}
                                        onClick={this.setHealthStatGraph.bind(this, "Blood Pressure")}
                                    >
                                        <span className="health-stats-label">Blood Pressure</span><br/>
                                        <div>
                                            <div className="stats-segment-1"><p className="heartrate-bpm">{this.props.selectedPatientVitalStats.bloodPressure}</p></div>
                                            <div className="stats-segment-2">
                                                <p className="heartrate-bpm-label">mmHg</p>
                                                <Glyphicon glyph="tint" className="bp-glyph"/>
                                            </div>
                                            <div className="stats-last-update">
                                                <p className="lastupdate"> <b>Last Update: </b> &nbsp; {moment(this.props.selectedPatientVitalStats.timestamp.seconds).format("lll")} </p>
                                            </div>
                                        </div>
                                    </div>
                                    </Col>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col lg={12}>
                                    <Row>
                                        <Col lg={12}>
                                            <div className="health-records-card">
                                                <div className="card-header">
                                                    <span className="health-records-label">Examination Records</span>
                                                    <Button className="header-option-btn" onClick={this.toggleHealthExaminationForm.bind(this)}><Glyphicon glyph="plus"/></Button>
                                                </div>
                                                <div className="card-content">
                                                    <p className="">
                                                        <HealthRecordsHistory 
                                                            healthRecords={this.state.patientHealthExaminationRecords}
                                                            toggleHealthExaminationRecord={this.toggleHealthExaminationRecord.bind(this)}
                                                        />
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <HealthExaminationForm
                        showHealthExaminationForm={this.state.showHealthExaminationForm}
                        closeHealthExaminationForm={this.toggleHealthExaminationForm.bind(this)}
                    />

                    {
                        this.state.selectedHealthExaminationRecord && 
                        <HealthExaminationRecord
                            healthRecord={this.state.selectedHealthExaminationRecord}
                            showHealthExaminationRecord={this.state.showHealthExaminationRecord}
                            closeHealthExaminationRecord={this.toggleHealthExaminationRecord.bind(this)}
                        />
                    }

                </Grid>
            </div>
        );
    }
}

class HealthRecordsMobileView extends Component {
    constructor () {
        super();
        this.state ={

        }
    }
    
    render() {
        return (
            <div></div>
        )
    }
}

export default withFirebase(HealthRecordsView);
