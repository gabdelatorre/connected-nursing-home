import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import {
    Grid, Row, Col, Button, FormControl
} from 'react-bootstrap';
import { withFirebase } from "../firebase/context";

export class HealthExaminationForm extends Component{

    constructor () {
        super();
        this.state = {
            latestStatsOfPatients:{}
        }
    }

    handleSubmit () {
        var patientId = this.props.selectedPatient.id;
        var nurseUid = this.props.authUser.uid;
        var nurseInCharge = this.props.userData.firstName + " " + this.props.userData.lastName;
        var weightFieldRecordValue = document.getElementById("weightFieldRecordValue").value;
        var heightFieldRecordValue = document.getElementById("heightFieldRecordValue").value;
        var heartRateFieldRecordValue = document.getElementById("heartRateFieldRecordValue").value;
        var bloodPressureFieldRecordValue = document.getElementById("bloodPressureFieldRecordValue").value;
        var temperatureFieldRecordValue = document.getElementById("temperatureFieldRecordValue").value;
        var medicationsFieldRecordValue = document.getElementById("medicationsFieldRecordValue").value;
        var remarksFieldRecordValue = document.getElementById("remarksFieldRecordValue").value;
        var timestampToday = new Date().toString();
        var timestamp = new Date();

        this.props.firebase.db
        .collection("patients")
        .doc(patientId)
        .update({
            "latestStats.bloodPressure": bloodPressureFieldRecordValue,
            "latestStats.heartRate" : heartRateFieldRecordValue,
            "latestStats.height" : heightFieldRecordValue,
            "latestStats.medications" : medicationsFieldRecordValue,
            "latestStats.remarks" : remarksFieldRecordValue,
            "latestStats.temperature" : temperatureFieldRecordValue,
            "latestStats.timestamp" : timestampToday,
            "latestStats.weight": weightFieldRecordValue
        })

        this.props.firebase.db
        .collection("patients")
        .doc(patientId)
        .collection("health_records")
        .doc()
        .set({
            bloodPressure: bloodPressureFieldRecordValue,
            heartRate: heartRateFieldRecordValue,
            height: heightFieldRecordValue,
            medications: medicationsFieldRecordValue,
            remarks: remarksFieldRecordValue,
            temperature: temperatureFieldRecordValue,
            timestamp: timestamp,
            nurseInCharge: nurseInCharge,
            uid: nurseUid,
            weight: weightFieldRecordValue
        });
        this.props.closeHealthExaminationForm();
    }

    closeModal() {
        this.props.closeHealthExaminationForm();
    }

    render(){

        return (
        <div className="health-records-form">
            <Modal show={this.props.showHealthExaminationForm} onHide={this.closeModal.bind(this)} bsSize="large">

            <Modal.Header closeButton>
                <Modal.Title className="modal-title"> Health Examination Form </Modal.Title>
            </Modal.Header>

            <Modal.Body className="modal-cont">
                <div className="health-records-form-content">
                    <Grid fluid>
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <Row className="field-row-entry">
                                    <Col lg={4} md={4} sm={4} xs={4}>
                                        <h4 className="labelform">Height</h4>
                                    </Col>
                                    <Col  lg={8} md={8} sm={8} xs={8}>
                                        <FormControl 
                                            type="text" 
                                            placeholder="" 
                                            inputRef={particular => this.particular = particular}
                                            defaultValue=""
                                            id="heightFieldRecordValue"
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <Row className="field-row-entry">
                                    <Col lg={4} md={4} sm={4} xs={4}>
                                        <h4 className="labelform">Weight</h4>
                                    </Col>
                                    <Col lg={8} md={8} sm={8} xs={8}>
                                        <FormControl 
                                            type="text" 
                                            placeholder="" 
                                            inputRef={particular => this.particular = particular}
                                            defaultValue=""
                                            id="weightFieldRecordValue"
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <Row className="field-row-entry">
                                    <Col lg={4} md={4} sm={4} xs={4}>
                                        <h4 className="labelform">Heart Rate</h4>
                                    </Col>
                                    <Col  lg={8} md={8} sm={8} xs={8}>
                                        <FormControl 
                                            type="text" 
                                            placeholder="" 
                                            inputRef={particular => this.particular = particular}
                                            defaultValue=""
                                            id="heartRateFieldRecordValue"
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <Row className="field-row-entry">
                                    <Col lg={4} md={4} sm={4} xs={4}>
                                        <h4 className="labelform">Blood Pressure</h4>
                                    </Col>
                                    <Col lg={8} md={8} sm={8} xs={8}>
                                        <FormControl 
                                            type="text" 
                                            placeholder="" 
                                            inputRef={particular => this.particular = particular}
                                            defaultValue=""
                                            id="bloodPressureFieldRecordValue"
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <Row className="field-row-entry">
                                    <Col lg={4} md={4} sm={4} xs={4}>
                                        <h4 className="labelform">Temperature</h4>
                                    </Col>
                                    <Col  lg={8} md={8} sm={8} xs={8}>
                                        <FormControl 
                                            type="text" 
                                            placeholder="" 
                                            inputRef={particular => this.particular = particular}
                                            defaultValue=""
                                            id="temperatureFieldRecordValue"
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <hr/>
                        <Row className="field-row-entry">
                            <Col lg={4} md={4} sm={4} xs={4}>
                                <h4 className="labelform"> Medications </h4>
                            </Col>
                            <Col  lg={8} md={8} sm={8} xs={8}>
                                <FormControl 
                                    componentClass="textarea"
                                    placeholder="" 
                                    defaultValue=""
                                    id="medicationsFieldRecordValue"
                                />
                            </Col>
                        </Row>
                        <Row className="field-row-entry">
                            <Col  lg={4} md={4} sm={4} xs={4}>
                                <h4 className="labelform"> Remarks </h4>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={8}>
                                <FormControl 
                                    componentClass="textarea"
                                    placeholder="" 
                                    defaultValue=""
                                    id="remarksFieldRecordValue"
                                />
                            </Col>
                        </Row>
                        <Row className="field-row-entry">
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <Button onClick={this.handleSubmit.bind(this)} className="modal-action-btn">
                                    Submit
                                </Button>
                            </Col> 
                        </Row>
                    </Grid>
                </div>
            </Modal.Body>
            </Modal>
        </div>
    );
    }
}

export default withFirebase(HealthExaminationForm);


