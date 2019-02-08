import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import {
    Grid, Row, Col, Button, FormControl
} from 'react-bootstrap';
import { withFirebase } from "../firebase/context";

export class HealthExaminationRecord extends Component{

    constructor () {
        super();
        this.state = {
        }
    }

    handleRemoveRecord () {
        var patientId = this.props.selectedPatient.id;

        this.props.firebase.db
        .collection("patients")
        .doc(patientId)
        .collection("health_records")
        .doc(this.props.healthRecord.id)
        .delete()
        .then(e => {
            console.log("Delete Successful!");
        });


        
        this.props.closeHealthExaminationRecord();
    }

    closeModal() {
        this.props.closeHealthExaminationRecord();
    }

    render(){
const buttonRole = () => {
    if (this.props.userRole == "Admin" || this.props.userRole == "Employee") {
    return (<Button onClick={this.handleRemoveRecord.bind(this)} className="modal-action-btn">
    Remove Record
    </Button>);
    }
}
        return (
        <div className="health-records-form">
            <Modal show={this.props.showHealthExaminationRecord} onHide={this.closeModal.bind(this)} bsSize="large">

            <Modal.Header closeButton>
                <Modal.Title className="modal-title"> Health Examination Record </Modal.Title>
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
                                    <Col lg={8} md={8} sm={8} xs={8}>
                                        {this.props.healthRecord.height}
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <Row className="field-row-entry">
                                    <Col lg={4} md={4} sm={4} xs={4}>
                                        <h4 className="labelform">Weight</h4>
                                    </Col>
                                    <Col lg={8} md={8} sm={8} xs={8}>
                                        {this.props.healthRecord.weight}
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
                                        {this.props.healthRecord.heartRate}
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <Row className="field-row-entry">
                                    <Col lg={4} md={4} sm={4} xs={4}>
                                        <h4 className="labelform">Blood Pressure</h4>
                                    </Col>
                                    <Col lg={8} md={8} sm={8} xs={8}>
                                        {this.props.healthRecord.bloodPressure}
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
                                        {this.props.healthRecord.temperature}
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
                                {this.props.healthRecord.medications} 
                            </Col>
                        </Row>
                        <Row className="field-row-entry">
                            <Col  lg={4} md={4} sm={4} xs={4}>
                                <h4 className="labelform"> Remarks </h4>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={8}>
                                {this.props.healthRecord.remarks}
                            </Col>
                        </Row>
                        <Row className="field-row-entry">
                            <Col lg={12} md={12} sm={12} xs={12}>
                            {buttonRole()}
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

export default withFirebase(HealthExaminationRecord);


