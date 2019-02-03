
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
class HealthRecordsView extends Component {

    constructor() {
        super();
        this.state = {
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
                this.setVal("bloodPressure", data.data().blood_pressure);
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

    render() {

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
                            </Row>

                            <Row>
                                <Col lg={8}>
                                    <div>
                                    <div className="health-stats-graph-card">
                                        <div className="card-header">
                                            <span className="health-stats-graph-label"> Graph</span>
                                        </div>
                                        <div className="card-content">
                                            <p className=""></p>
                                        </div>
                                    </div>
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className="health-stats-card">
                                        <span className="health-stats-label">Heart Rate</span><br/>
                                        <div>
                                            <div className="stats-segment-1"><p className="heartrate-bpm">{this.props.selectedPatientVitalStats.HeartRate}</p></div>
                                            <div className="stats-segment-2">
                                                <p className="heartrate-bpm-label">BPM</p>
                                                <Glyphicon glyph="heart" className="heart-glyph" style={this.props.heartAnimation}/>
                                            </div>
                                            <div className="stats-last-update">
                                                <p className="lastupdate"> <b>Last Update: </b> &nbsp; {moment.unix(this.props.selectedPatientVitalStats.timestamp.seconds).format("lll")} </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="health-stats-card">
                                        <span className="health-stats-label">Temperature</span><br/>
                                        <div>
                                            <div className="stats-segment-1"><p className="heartrate-bpm">{this.props.selectedPatientVitalStats.Temperature}</p></div>
                                            <div className="stats-segment-3">
                                                <p className="heartrate-bpm-label">°C</p>
                                            </div>
                                            <div className="stats-last-update">
                                                <p className="lastupdate"> <b>Last Update: </b> &nbsp; {} </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="health-stats-card">
                                        <span className="health-stats-label">Blood Pressure</span><br/>
                                        <div>
                                            <div className="stats-segment-1"><p className="heartrate-bpm">{this.props.selectedPatientVitalStats.BloodPressure}</p></div>
                                            <div className="stats-segment-2">
                                                <p className="heartrate-bpm-label">mmHg</p>
                                                <Glyphicon glyph="tint" className="bp-glyph"/>
                                            </div>
                                            <div className="stats-last-update">
                                                <p className="lastupdate"> <b>Last Update: </b> &nbsp; {moment.unix(this.props.selectedPatientVitalStats.timestamp.seconds).format("lll")} </p>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col lg={12}>
                                    <Row>
                                        <Col lg={12}>
                                            <div className="health-records-card">
                                                <div className="card-header">
                                                    <span className="health-records-label">Examination Records</span>
                                                    <Button className="header-option-btn"><Glyphicon glyph="plus"/></Button>
                                                </div>
                                                <div className="card-content">
                                                    <p className=""><HealthRecordsHistory/></p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default withFirebase(HealthRecordsView);
