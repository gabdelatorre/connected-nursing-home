import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import {
    Grid, Row, Col, Button, FormControl
} from 'react-bootstrap';

export class HealthExaminationRecord extends Component{

    constructor () {
        super();
        this.state = {
        }
    }

    handleSubmit () {

    }

    closeModal() {
        this.props.closeHealthExaminationRecord();
    }

    render(){

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
                                        <h4 className="labelform">Temperature</h4>
                                    </Col>
                                    <Col  lg={8} md={8} sm={8} xs={8}>
                                        {this.props.healthRecord.temperature}
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
                    </Grid>
                </div>
            </Modal.Body>
            </Modal>
        </div>
    );
    }
}

export default HealthExaminationRecord;


