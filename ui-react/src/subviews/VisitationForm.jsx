import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import {
    Grid, Row, Col, Button, FormControl, Alert
} from 'react-bootstrap';
import { withFirebase } from "../firebase/context";
import axios from 'axios';

export class VisitationForm extends Component{

    constructor () {
        super();
        this.state = {
            latestStatsOfPatients:{},
            alertOn : false,
            alertMsg: ""
        }
    }

    componentDidMount(){
    }


    handleApprove() {
        var visitorEmail = this.props.selectedVisitor.visitorEmail;
        var patientId = this.props.selectedPatient.id;
        var docName = this.props.selectedVisitor.visitorIdDoc;
        var visitationRemarks = this.visitationRemarks.value;
        var linkToCloudFunction = "https://us-central1-connected-nursing-home.cloudfunctions.net/emailQR?" +
        "visitorEmail="+ visitorEmail +
        "&patientID=" + patientId + 
        "&docName=" + docName;

        axios.get(linkToCloudFunction)
        .then(response => {
        console.log(response.data);
        this.props.firebase.db
        .collection("patients")
        .doc(patientId)
        .collection("visitor_logs")
        .doc(docName)
        .update({
            remarks: visitationRemarks,
            status: "EmailSent",
        })
        this.closeVisitationModal.bind(this)
        })
        .catch(response => 
            this.setState({
                alertOn: true,
                alertMsg: response.data
            })
        );
    }

    handleReject() { 
        var patientId = this.props.selectedPatient.id;
        var visitationRemarks = this.visitationRemarks.value;

        this.props.firebase.db
        .collection("patients")
        .doc(patientId)
        .collection("visitor_logs")
        .doc(this.props.selectedVisitor.visitorIdDoc)
        .update({
            remarks: visitationRemarks,
            status: "Rejected",
        })

        this.closeVisitationModal.bind(this)
    }


    timestampFormatter(timestamp) {
        var newDate = new Date(timestamp);
    
        return [newDate.getFullYear(), newDate.getMonth()+1, newDate.getDate()].join("-");
      }

    handleSubmit () {
        var tm_year = this.visitationDate.value.split('-')[0];
        var tm_month = this.visitationDate.value.split('-')[1];
        var tm_day = this.visitationDate.value.split('-')[2];
        
        var patientId = this.props.selectedPatient.id;
        var visitorName = this.props.userData.firstName + " " + this.props.userData.lastName;
        var visitorEmail = this.visitorEmail.value;
        var visitationDate = new Date(tm_year, tm_month-1, tm_day);
        visitationDate = this.timestampFormatter(visitationDate);
        var dateCreated = new Date();
        var docName = visitationDate + "-" + this.props.userData.firstName + "_" + this.props.userData.lastName;  
        
        this.props.firebase.db
        .collection("patients")
        .doc(patientId)
        .collection("visitor_logs")
        .doc(docName)
        .set({
            visitorName: visitorName,
            visitorEmail: visitorEmail,
            visitationDate: visitationDate,
            status: "NotValidated",
            dateCreated: dateCreated,
            remarks: ""
        })
    }

    closeVisitationModal() {
        this.props.closeVisitationForm();
    }



    render(){
        const buttonRole = () => {
            if (this.props.selectedVisitor.status== "Validated" || this.props.selectedVisitor.status == "EmailSent" || this.props.selectedVisitor.status == "Rejected") {
                return (
                        <Row className="field-row-entry">
                            <Col lg={4} md={4} sm={4} xs={4}>
                            <h4 className="labelform"> Remarks </h4>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={8}>
                                <FormControl 
                                    componentClass="textarea"
                                    plaintext
                                    defaultValue={this.props.selectedVisitor.remarks}
                                />
                            </Col>
                        </Row>
                    );
            } else if (this.props.userRole == "Admin" && this.props.selectedVisitor.status == "NotValidated") {
                return (
                <div>
                    <Row className="field-row-entry">
                        <Col lg={4} md={4} sm={4} xs={4}>
                        <h4 className="labelform"> Remarks </h4>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={8}>
                            <FormControl 
                                componentClass="textarea"
                                placeholder="" 
                                defaultValue=""
                                inputRef={ref => {this.visitationRemarks = ref;}}
                            />
                        </Col>
                    </Row>
                    <Row className="field-row-entry">
                        <Col lg={6} md={6} sm={6} xs={6}>
                            <Button onClick={this.handleApprove.bind(this)} className="modal-action-btn">
                                Approve
                            </Button>
                        </Col> 
                        <Col lg={6} md={6} sm={6} xs={6}>
                            <Button onClick={this.handleReject.bind(this)} className="modal-action-default-btn">
                                Reject
                            </Button>
                        </Col> 
                    </Row>
                </div>
                );
            } else if (this.props.selectedVisitor.status == "") {
                return (
                <Row className="field-row-entry">
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Button onClick={this.handleSubmit.bind(this)} className="modal-action-btn">
                            Submit
                        </Button>
                    </Col> 
                </Row>
                );
            }
        }

        const changeStateAlert = () => {
            this.setState({
                alertOn: false
            })
        }
        const alertRole = () => {
            if (this.state.alertOn == true) {
                setTimeout(function() {
                    changeStateAlert();
                }, 2000);
                return (<Alert variant="success"><p>{this.state.alertMsg}</p></Alert>);
            }
        }


        if (this.props.userRole == "Admin") {
            return (
                <div className="visitation-form">
                    <Modal show={this.props.showVisitationForm} onHide={this.closeVisitationModal.bind(this)} bsSize="large">

                        <Modal.Header closeButton>
                            <Modal.Title className="modal-title"> Visitation Form </Modal.Title>
                        </Modal.Header>

                        <Modal.Body className="modal-cont">
                            <div className="health-records-form-content">
                                <Grid fluid>
                                    <Row className="field-row-entry">
                                        <Col lg={4} md={4} sm={4} xs={4}>
                                            <h4 className="labelform"> Patient Name </h4>
                                        </Col>
                                        <Col  lg={8} md={8} sm={8} xs={8}>
                                            <FormControl 
                                                plaintext 
                                                inputRef={visitationPatientName => this.visitationPatientName = visitationPatientName}
                                                defaultValue={this.props.selectedPatient.firstName + " " + this.props.selectedPatient.lastName} 
                                                readOnly
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="field-row-entry">
                                        <Col  lg={4} md={4} sm={4} xs={4}>
                                            <h4 className="labelform"> Visitor Name </h4>
                                        </Col>
                                        <Col lg={8} md={8} sm={8} xs={8}>
                                            <FormControl 
                                            plaintext 
                                                inputRef={visitorName => this.visitorName = visitorName}
                                                defaultValue={this.props.selectedVisitor.visitorName}
                                                readOnly
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="field-row-entry">
                                        <Col  lg={4} md={4} sm={4} xs={4}>
                                            <h4 className="labelform"> Visitor Email </h4>
                                        </Col>
                                        <Col lg={8} md={8} sm={8} xs={8}>
                                            <FormControl 
                                            plaintext 
                                                inputRef={visitorEmail => this.visitorEmail = visitorEmail}
                                                defaultValue={this.props.selectedVisitor.visitorEmail}
                                                readOnly
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="field-row-entry">
                                        <Col lg={4} md={4} sm={4} xs={4}>
                                        <h4 className="labelform"> Visitation Date </h4>
                                        </Col>
                                        <Col lg={8} md={8} sm={8} xs={8}>
                                            <br/>
                                            <input className="forminput" type="date" ref={(visitationDate) => this.visitationDate = visitationDate} defaultValue={this.props.selectedVisitor.status == "" ? "" : this.props.selectedVisitor.visitationDate}/>
                                        </Col>
                                    </Row>
                                    {buttonRole()}
                                </Grid> 
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            );
        } else if (this.props.userRole == "Relative" || this.props.userRole == "Employee") {
            return (
                <div className="visitation-form">
                    <Modal show={this.props.showVisitationForm} onHide={this.closeVisitationModal.bind(this)} bsSize="large">

                        <Modal.Header closeButton>
                            <Modal.Title className="modal-title"> Visitation Form </Modal.Title>
                        </Modal.Header>

                        <Modal.Body className="modal-cont">
                            <div className="health-records-form-content">
                                <Grid fluid>
                                    <Row className="field-row-entry">
                                        <Col lg={4} md={4} sm={4} xs={4}>
                                            <h4 className="labelform"> Patient Name </h4>
                                        </Col>
                                        <Col  lg={8} md={8} sm={8} xs={8}>
                                            <FormControl 
                                                plaintext 
                                                inputRef={visitationPatientName => this.visitationPatientName = visitationPatientName}
                                                defaultValue={this.props.selectedPatient.firstName + " " + this.props.selectedPatient.lastName} 
                                                readOnly
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="field-row-entry">
                                        <Col  lg={4} md={4} sm={4} xs={4}>
                                            <h4 className="labelform"> Visitor Name </h4>
                                        </Col>
                                        <Col lg={8} md={8} sm={8} xs={8}>
                                            <FormControl 
                                            plaintext 
                                                inputRef={visitorName => this.visitorName = visitorName}
                                                defaultValue={this.props.selectedVisitor.status == "" ? this.props.userData.firstName + " " + this.props.userData.lastName : this.props.selectedVisitor.visitorName}
                                                readOnly
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="field-row-entry">
                                        <Col  lg={4} md={4} sm={4} xs={4}>
                                            <h4 className="labelform"> Visitor Email </h4>
                                        </Col>
                                        <Col lg={8} md={8} sm={8} xs={8}>
                                            <FormControl 
                                            plaintext 
                                                inputRef={visitorEmail => this.visitorEmail = visitorEmail}
                                                defaultValue={this.props.selectedVisitor.status == "" ? this.props.userData.firstName : this.props.selectedVisitor.visitationDate}
                                                readOnly
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="field-row-entry">
                                        <Col lg={4} md={4} sm={4} xs={4}>
                                        <h4 className="labelform"> Visitation Date </h4>
                                        </Col>
                                        <Col lg={8} md={8} sm={8} xs={8}>
                                            <br/>
                                            <input className="forminput" type="date" ref={(visitationDate) => this.visitationDate = visitationDate} defaultValue={this.props.selectedVisitor.status == "" ? "" : this.props.selectedVisitor.visitationDate}/>
                                        </Col>
                                    </Row>
                                    {buttonRole()}
                                </Grid> 
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            );
        }   
    }
}

export default withFirebase(VisitationForm);


