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

    render() {

        return (
            <div className="health-records-view">
                {/* <div className="breadcrumbs-view">
                    <h3 className="breadcrumb"> My Dashboard &nbsp; > &nbsp; Patient  > &nbsp; Medical Records</h3>
                </div> */}
                <Grid fluid>
                    <Row>
                        <Col lg={2}>
                            <div className="health-pic-card">
                                <img src={samplepic} className="profilepic"/>
                            </div>
                        </Col>
                        <Col lg={7}>
                            <div>
                            <div className="health-profile-card">
                                <div className="card-header">
                                    <span className="health-profile-label">Profile</span>
                                </div>
                                <div className="card-content">
                                    <p className=""></p>
                                </div>
                            </div>
                            <div className="health-records-card">
                                <div className="card-header">
                                    <span className="health-records-label">Examination Records</span>
                                </div>
                                <div className="card-content">
                                    <p className=""><HealthRecordsHistory/></p>
                                </div>
                            </div>
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="health-stats-card">
                                <span className="health-stats-label">Heart Rate</span><br/>
                                <div>
                                    <div className="stats-segment-1"><p className="heartrate-bpm">90</p></div>
                                    <div className="stats-segment-2">
                                        <p className="heartrate-bpm-label">BPM</p>
                                        <Glyphicon glyph="heart" className="heart-glyph"/>
                                    </div>
                                </div>
                            </div>
                            <div className="health-stats-card">
                                <span className="health-stats-label">Temperature</span><br/>
                                <div>
                                    <div className="stats-segment-1"><p className="heartrate-bpm">37.1</p></div>
                                    <div className="stats-segment-3">
                                        <p className="heartrate-bpm-label">°C</p>
                                    </div>
                                </div>
                            </div>
                            <div className="health-stats-card">
                                <span className="health-stats-label">Blood</span><br/>
                                <div>
                                    <div className="stats-segment-1"><p className="heartrate-bpm">110/70</p></div>
                                    <div className="stats-segment-2">
                                        <p className="heartrate-bpm-label">mmHg</p>
                                        <Glyphicon glyph="tint" className="heart-glyph"/>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default withFirebase(HealthRecordsView);
