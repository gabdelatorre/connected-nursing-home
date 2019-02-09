
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
                    timestamps: null,
                    nurseId: null,
                    temperature: null,
                    bloodPressure: null,
                    heartRate: null,
                    medications: null,
                    remarks: null,
                    height: null,
                    weight: null,
                }
            ],
            tempTimestamp : null,
            tempNurseId: null,
            doctorsName: null,
            selectedHealthExaminationRecord: null,
            heartRateHistory: []
        };

    }

    componentDidMount() {
        console.log("HealthRecordsView: componentDidMount");
        this.getPatientHealthRecord();    
    }

    extractHealthStatsForGraph () {
        console.log(this.props.selectedPatient);
        console.log(this.props.selectedPatientStatsHistory);
       
        var tempHeartRateHistory = [
            {
                color: "red",
                points: []
            }
        ]

        var tempBloodPressureHistory = [
            {
                color: "red",
                points: []
            },
            {
                color: "blue",
                points: []
            },
        ]
        
        var tempTemperatureHistory = [
            {
                color: "red",
                points: [{x: 1, y: 37.2}, {x: 2, y: 38}, ]
            },
        ]

        this.props.selectedPatientStatsHistory.forEach((record) => {
            console.log(record);

            tempHeartRateHistory[0].points.push({
                x: tempHeartRateHistory[0].points.length + 1,
                y: record.state.reported.HeartRate
            })

            console.log(tempHeartRateHistory);

            // Systolic
            tempBloodPressureHistory[0].points.push({
                x: tempBloodPressureHistory[0].points.length + 1,
                y: parseInt(record.state.reported.BloodPressure.split('/')[0])
            })

            // Diastolic
            tempBloodPressureHistory[1].points.push({
                x: tempBloodPressureHistory[1].points.length + 1,
                y: parseInt(record.state.reported.BloodPressure.split('/')[1])
            })

            console.log(tempHeartRateHistory);
            console.log(tempBloodPressureHistory);
        })


        if (this.state.selectedHealthStatGraph === "Heart Rate") {
            return tempHeartRateHistory;
        }
        else if (this.state.selectedHealthStatGraph === "Blood Pressure") {
            return tempBloodPressureHistory;
        }
        else if (this.state.selectedHealthStatGraph === "Temperature") {
            return tempTemperatureHistory;
        }
        else {
            return tempHeartRateHistory;
        }
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

    getPatientHealthRecord() {
        var patientId = this.props.selectedPatient.id;
        console.log(patientId);
        this.props.firebase.db
        .collection("patients")
        .doc(patientId)
        .collection("health_records")
        .orderBy("timestamp", "desc")
        .onSnapshot(e=>{
            this.setState({
                patientHealthExaminationRecords: []
            })
            e.docs.forEach(e=>{
                console.log(e.data().timestamp + " SASAS");
                this.setState({
                    tempTimestamp:e.data().timestamp.toDate(),
                    tempNurseId: e.data().uid
                })
                var dateTimestamp = this.state.tempTimestamp;
                console.log(dateTimestamp);
                dateTimestamp = [dateTimestamp.getMonth()+1, dateTimestamp.getDate(), dateTimestamp.getFullYear()].join('/')+ ' ' +
                [dateTimestamp.getHours(), dateTimestamp.getMinutes(), dateTimestamp.getSeconds()].join(':');
             
                this.props.firebase.db
                .collection("users")
                .doc(this.state.tempNurseId)
                .get()
                .then(d => { 

                    this.setState({
                        patientHealthExaminationRecords: this.state.patientHealthExaminationRecords.concat([
                            {
                                timestamps:  dateTimestamp,
                                nurseId:  d.data().lastName + ", " + d.data().firstName,
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

                });

            })
        })
    }

    render() {
        const buttonRole = () => {
            if(this.props.userRole == "Relative") {
                
            } else {
           return <Button className="header-option-btn" onClick={this.toggleHealthExaminationForm.bind(this)}><Glyphicon glyph="plus"/></Button>
            }
        }

        var graphData = this.extractHealthStatsForGraph();

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
                                            {/* {   this.state.heartRateHistory.length != 0 && */}
                                                <LineChart 
					                            	width={600}
					                            	height={400}
                                                    data={graphData}
                                                    xLabel="Instance"
                                                    yLabel={this.state.selectedHealthStatGraph}
					                            />
                                            {/* } */}
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
                                                <p className="lastupdate"> <b>Last Update: </b> &nbsp; {moment(this.props.selectedPatientVitalStats.timestamp).format("lll")} </p>
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
                                                <p className="lastupdate"> <b>Last Update: </b> &nbsp; {moment(this.props.selectedPatientVitalStats.timestamp).format("lll")} </p>
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
                                                    {buttonRole()}
                                                </div>
                                                <div className="card-content">
                                                    <p className="">
                                                        <HealthRecordsHistory 
                                                            healthRecords={this.state.patientHealthExaminationRecords}
                                                            toggleHealthExaminationRecord={this.toggleHealthExaminationRecord.bind(this)}
                                                            userRole = {this.props.userRole}
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
                        selectedPatient={this.props.selectedPatient}
                        authUser = {this.props.authUser}
                    />

                    {
                        this.state.selectedHealthExaminationRecord && 
                        <HealthExaminationRecord
                            healthRecord={this.state.selectedHealthExaminationRecord}
                            showHealthExaminationRecord={this.state.showHealthExaminationRecord}
                            closeHealthExaminationRecord={this.toggleHealthExaminationRecord.bind(this)}
                            selectedPatient={this.props.selectedPatient}
                            userRole = {this.props.userRole}
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
