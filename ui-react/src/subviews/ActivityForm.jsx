import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import {
    Grid, Row, Col, Button, FormControl
} from 'react-bootstrap';
import { withFirebase } from "./../firebase/context";

export class ActivityForm extends Component{

    constructor () {
        super();
        this.state = {
            latestStatsOfPatients:{}
        }
    }

    componentDidMount(){
        console.log("Activityform");
        console.log(this.props.firebase);
    }

    handleSubmit () {

        var tm_year = this.activityDate.value.split('-')[0];
        var tm_month = this.activityDate.value.split('-')[1];
        var tm_day = this.activityDate.value.split('-')[2];
        var tm_hour = this.activityTime.value.split(':')[0];
        var tm_sec = this.activityTime.value.split(':')[1];

        var Etm_year = this.activityEndDate.value.split('-')[0];
        var Etm_month = this.activityEndDate.value.split('-')[1];
        var Etm_day = this.activityEndDate.value.split('-')[2];
        var Etm_hour = this.activityEndTime.value.split(':')[0];
        var Etm_sec = this.activityEndTime.value.split(':')[1];

        console.log(tm_year);
        console.log(tm_month);
        console.log(tm_day);
        var timestamp = new Date(tm_year, tm_month-1, tm_day, tm_hour, tm_sec);
        var Etimestamp = new Date(Etm_year, Etm_month-1, Etm_day, Etm_hour, Etm_sec);
        console.log(timestamp);

        this.props.firebase.db
        .collection("patients")
        .doc(this.props.selectedPatient.id)
        .collection("activity")
        .doc()
        .set({
            "status": "Planned",
            "activityDate": timestamp,
            "activityEndDate": Etimestamp,
            "activityName": this.activityName.value,
            "activityDesc": this.activityDesc.value,
            "activityDateCompleted": "",
        })

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
                            <Col lg={4} md={4} sm={4} xs={4}>
                                <h4>Start Date</h4>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={8}>
                                <input className="forminput" type="date" ref={(activityDate) => this.activityDate = activityDate} />
                                <br/>
                                Time
                                <FormControl 
                                    componentClass="textarea"
                                    placeholder="" 
                                    inputRef={activityTime => this.activityTime = activityTime}
                                    defaultValue=""
                                />
                            </Col>
                        </Row>
                        <Row className="field-row-entry">
                            <Col lg={4} md={4} sm={4} xs={4}>
                                <h4>End Date</h4>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={8}>
                                <input className="forminput" type="date" ref={(activityEndDate) => this.activityEndDate = activityEndDate} />
                                <br/>
                                Time
                                <FormControl 
                                    componentClass="textarea"
                                    placeholder="" 
                                    inputRef={activityEndTime => this.activityEndTime = activityEndTime}
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


