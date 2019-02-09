import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import {
    Grid, Row, Col, Button, FormControl
} from 'react-bootstrap';
import { withFirebase } from "../firebase/context";

export class ActivityForm extends Component{

    constructor () {
        super();
        this.state = {
            latestStatsOfPatients:{}
        }
    }

    handleSubmit () {
        this.props.firebase.db.collection("patients").doc(this.props.selectedPatient.id).collection("activity").add({
            "status": "In Progress",
            "activityDate": this.activityDate.value,
            "activityName": this.activityName.value,
            "activityDesc": this.activityDesc.value
        }).then(
            console.log("Successful")
        )

        this.props.closeActivityForm();
    }

    closeModal() {
        this.props.closeActivityForm();
    }

    render(){

        return (
        <div className="health-records-form">
            <Modal show={this.props.showActivityForm} onHide={this.closeModal.bind(this)} bsSize="large">

            <Modal.Header closeButton>
                <Modal.Title className="modal-title"> Activity Form </Modal.Title>
            </Modal.Header>

            <Modal.Body className="modal-cont">
                <div className="health-records-form-content">
                    <Grid fluid>
                        <Row className="field-row-entry">
                            <Col lg={4} md={4} sm={4} xs={4}>
                                <h4 className="labelform"> Activity Name </h4>
                            </Col>
                            <Col  lg={8} md={8} sm={8} xs={8}>
                                <FormControl 
                                    componentClass="textarea"
                                    placeholder="" 
                                    inputRef={activityName => this.activityName = activityName}
                                    defaultValue=""
                                />
                            </Col>
                        </Row>
                        <Row className="field-row-entry">
                            <Col  lg={4} md={4} sm={4} xs={4}>
                                <h4 className="labelform"> Activity Description </h4>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={8}>
                                <FormControl 
                                    componentClass="textarea"
                                    placeholder="" 
                                    inputRef={activityDesc => this.activityDesc = activityDesc}
                                    defaultValue=""
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

export default withFirebase(ActivityForm);


