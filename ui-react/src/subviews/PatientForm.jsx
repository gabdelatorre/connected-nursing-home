import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import {
    Grid, Row, Col, Button, FormControl
} from 'react-bootstrap';
import { withFirebase } from "./../firebase/context";
import { normalize } from 'path';

export class PatientForm extends Component{

    constructor () {
        super();
        this.state = {
            latestStatsOfPatients:{}
        }
    }

    componentDidMount(){
        console.log("PatientForm");
        console.log(this.props.firebase);
    }

    handleSubmit () {

        var latestStats = {
            bloodPressure: this.bloodPressure.value,
            heartRate: this.heartRate.value,
            temperature: this.temperature.value,
            height: this.height.value,
            weight: this.weight.value,
            medications: this.medications.value,
            remarks: this.remarks.value,
            medications: this.medications.value,
            timestamp: new Date(),
        }

        this.props.firebase.db
            .collection("patients")
            .add({
              birthdate: this.birthDate.value,
              firstName: this.firstName.value,
              lastName: this.lastName.value,
              latestStats: latestStats,
              role: "Patient"
            })
            .then(docRef => {});
        
        this.props.closePatientForm();
    }

    closeModal() {
        this.props.closePatientForm();
    }

    render(){

        return (
        <div className="health-records-form">
            <Modal show={this.props.showPatientForm} onHide={this.closeModal.bind(this)} bsSize="large">

            <Modal.Header closeButton>
                <Modal.Title className="modal-title"> Patient Form </Modal.Title>
            </Modal.Header>

            <Modal.Body className="modal-cont">
                <div className="health-records-form-content">
                    <Grid fluid>
                        <Row className="field-row-entry">
                            <Col lg={4} md={4} sm={4} xs={4}>
                                <h4 className="labelform"> First Name </h4>
                            </Col>
                            <Col  lg={8} md={8} sm={8} xs={8}>
                                <FormControl 
                                    componentClass="textarea"
                                    placeholder="" 
                                    inputRef={firstName => this.firstName = firstName}
                                    defaultValue=""
                                />
                            </Col>
                        </Row>
                        <Row className="field-row-entry">
                            <Col lg={4} md={4} sm={4} xs={4}>
                                <h4 className="labelform"> Last Name </h4>
                            </Col>
                            <Col  lg={8} md={8} sm={8} xs={8}>
                                <FormControl 
                                    componentClass="textarea"
                                    placeholder="" 
                                    inputRef={lastName => this.lastName = lastName}
                                    defaultValue=""
                                />
                            </Col>
                        </Row>
                        <Row className="field-row-entry">
                            <Col lg={4} md={4} sm={4} xs={4}>
                                <h4 className="labelform"> Birth Date </h4>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={8}>
                                <input className="forminput" type="date" ref={(birthDate) => this.birthDate = birthDate} />
                            </Col>
                        </Row>
                        <hr/>
                        
                        <Row className="field-row-entry">
                            <Col  lg={4} md={4} sm={4} xs={4}>
                                <h4 className="labelform"> Height </h4>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={8}>
                                <FormControl 
                                    componentClass="textarea"
                                    placeholder="" 
                                    inputRef={height => this.height = height}
                                    defaultValue=""
                                />
                            </Col>
                        </Row>
                        
                        <Row className="field-row-entry">
                            <Col  lg={4} md={4} sm={4} xs={4}>
                                <h4 className="labelform"> Weight </h4>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={8}>
                                <FormControl 
                                    componentClass="textarea"
                                    placeholder="" 
                                    inputRef={weight => this.weight = weight}
                                    defaultValue=""
                                />
                            </Col>
                        </Row>
                        
                        <Row className="field-row-entry">
                            <Col  lg={4} md={4} sm={4} xs={4}>
                                <h4 className="labelform"> Blood Pressure </h4>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={8}>
                                <FormControl 
                                    componentClass="textarea"
                                    placeholder="" 
                                    inputRef={bloodPressure => this.bloodPressure = bloodPressure}
                                    defaultValue=""
                                />
                            </Col>
                        </Row>
                        <Row className="field-row-entry">
                            <Col  lg={4} md={4} sm={4} xs={4}>
                                <h4 className="labelform"> Heart Rate </h4>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={8}>
                                <FormControl 
                                    componentClass="textarea"
                                    placeholder="" 
                                    inputRef={heartRate => this.heartRate = heartRate}
                                    defaultValue=""
                                />
                            </Col>
                        </Row>
                        <Row className="field-row-entry">
                            <Col  lg={4} md={4} sm={4} xs={4}>
                                <h4 className="labelform"> Temperature </h4>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={8}>
                                <FormControl 
                                    componentClass="textarea"
                                    placeholder="" 
                                    inputRef={temperature => this.temperature = temperature}
                                    defaultValue=""
                                />
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
                                    inputRef={medications => this.medications = medications}
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
                                    inputRef={remarks => this.remarks = remarks}
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

export default withFirebase(PatientForm);


