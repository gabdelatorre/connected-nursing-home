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

      var editPatient = this.props.editPatient;
      if(editPatient) {
        updatePatient(editPatient.id,{
          birthdate: this.birthDate.value,
          firstName: this.firstName.value,
          lastName: this.lastName.value
        }, this.props.firebase.db);
      } else {
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
      }

      this.props.closePatientForm();
    }

    closeModal() {
        this.props.closePatientForm();
    }

    render(){
        var editPatient = this.props.editPatient;
        if(editPatient) {
          return (
            <div className="health-records-form">
                <Modal show={this.props.showPatientForm} onHide={this.closeModal.bind(this)} bsSize="large">

                <Modal.Header closeButton>
                    <Modal.Title className="modal-title">Edit Patient Form </Modal.Title>
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
                                        defaultValue={editPatient.firstName}
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
                                        defaultValue={editPatient.lastName}
                                    />
                                </Col>
                            </Row>
                            <Row className="field-row-entry">
                                <Col lg={4} md={4} sm={4} xs={4}>
                                    <h4 className="labelform"> Birth Date </h4>
                                </Col>
                                <Col lg={8} md={8} sm={8} xs={8}>
                                    <input
                                      className="forminput"
                                      type="date"
                                      ref={(birthDate) => this.birthDate = birthDate}
                                      defaultValue={editPatient.birthdate} />
                                </Col>
                            </Row>
                            <hr/>

                            <Row className="field-row-entry">
                                <Col lg={12} md={12} sm={12} xs={12}>
                                    <Button onClick={this.handleSubmit.bind(this)} className="modal-action-btn">
                                        Update
                                    </Button>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                </Modal.Body>
                </Modal>
            </div>
          )
        }

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

function updatePatient(patientId, payload, dbinstance, callback) {
  console.log(patientId);
  var patientsRef = dbinstance.collection("patients");
  var usersRef = dbinstance.collection("users");

  //update data initially;
  patientsRef
    .doc(patientId)
    .update(payload);

  //Retrieve affected user's ids
  var retrieveUsers = [], affectedUsers = [];
  retrieveUsers.push(
    patientsRef //one for relatives
      .doc(patientId)
      .collection("relatives")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach(doc => {
          affectedUsers.push({id:doc.id, collection:"relatives"});
        });
        return null;
      }),
    patientsRef //one for nurses
      .doc(patientId)
      .collection("nurse_Assigned")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach(doc => {
          affectedUsers.push({id:doc.id, collection:"patients"});
        });
        return null;
      }),
  );

  //Process affected users
  var updateUsers = [];
  Promise.all(retrieveUsers).then(() =>{
    affectedUsers.forEach((user) => {
      updateUsers.push(
        usersRef
          .doc(user.id)
          .collection(user.collection)
          .doc(patientId)
          .set(payload)
          .then(() => {
            return null; //resolve promise
          })
      )
    });

    Promise.all(updateUsers).then(() => {
      // do something after users are updated
    });
  });
}
