import moment from "moment";
import React, { Component, optionsState } from "react";
import { FirebaseContext } from "../firebase";
import { Table } from "react-bootstrap";
import { withFirebase } from "../firebase/context";
import { Grid, Row, Col, Glyphicon, Button } from "react-bootstrap";
import VisitationRelativeListOfPatient from "./VisitationRelativeListOfPatient";
import { VisitationForm } from "./VisitationForm";

class VisitationView extends Component {
  constructor() {
    super();

    this.state = {
      tempStorageOfData: {
        firstName: null,
        lastName: null,
        id: null
      },
      arrayOfPatientRelative: [],
      showVisitationForm: false,
      selectedVisitor: {
        visitorName: null,
        visitorEmail: null,
        visitationDate: null,
        status: null
      }
    }
  }

  componentWillMount() {
    this.toggleRelative();
  }

  goBack() {
    this.props.switchDashboardView("DASHBOARD");
  }

  
  toggleRelative(){
    
    var patientId = this.props.selectedPatient.id;
    this.props.firebase.db.collection("patients").doc(patientId).collection("relatives").onSnapshot(e =>{
      this.setState({
        tempStorageOfData: {
          firstName: null,
          lastName: null,
          id: null
        },
        arrayOfPatientRelative: []
      });
        e.docs.forEach(e =>{
          this.setState({
            tempStorageOfData: {
              firstName: e.data().firstName,
              lastName: e.data().lastName,
              id: e.id
            },
          });
          
          this.setState ({
            arrayOfPatientRelative: this.state.arrayOfPatientRelative.concat(
              this.state.tempStorageOfData
            )
          })
        })
    })

    this.setState({
      tempStorageOfData: {
        firstName: null,
        lastName: null,
        id: null
      }
    });
   
}


toggleVisitationForm (selectedVisitorName, selectedVisitorDate, selectedVisitorEmail, selectedVisitorIdDoc, status, remarks) {

  if (this.state.showVisitationForm) {
    this.setState({
      selectedVisitor: {
        visitorName: null,
        visitorEmail: null,
        visitationDate: null,
        visitorIdDoc: null,
        status: null,
        remarks: null
      }
    })
 
      this.setState({
        showVisitationForm: false
      })
  }
  else {
    var visitorDate = new Date(selectedVisitorDate);
    visitorDate = this.timestampFormatter(visitorDate).toString();
    this.setState({
      selectedVisitor: {
        visitorName: selectedVisitorName,
        visitorEmail: selectedVisitorEmail,
        visitationDate: visitorDate,
        visitorIdDoc : selectedVisitorIdDoc,
        status : status,
        remarks: remarks
      }
    })

      this.setState({
        showVisitationForm: true
      })
  }
}


timestampFormatter(timestamp) {
  var newDate = new Date(timestamp);
  var month = newDate.getMonth()+1;
  if (month < 10) {
    month = "0"+month;
  }
  return [newDate.getFullYear(), month, newDate.getDate()].join('-')
}
  render() {
    const buttonRole = () => {
      if(this.props.userRole == "Relative") {
        return <Button className="header-option-btn" onClick={this.toggleVisitationForm.bind(this, "", "", "", "", "", "")}><Glyphicon glyph="plus"/></Button>
      } 
  }

    const visitorsTable = this.props.arrayOfVisitors.map((prop) => {
      if (this.props.userRole == "Admin") {
        return (
          <tr onClick={this.toggleVisitationForm.bind(
            this,
            prop.visitorName,
            prop.visitationDate,
            prop.visitorEmail,
            prop.id,
            prop.status,
            prop.remarks
          )} 
            className={prop.status == "Validated" ?  "" : prop.status == "EmailSent" ? "table-row-emailsent": prop.status == "Rejected" ? "table-row-rejected" : "table-row-waiting" } >
            <td> {prop.dateCreated} </td>
            <td> {prop.visitationDate} </td> 
            <td> {prop.visitorName} </td>
            <td> {prop.status == "Validated" ? "Approved" : prop.status == "EmailSent" ? "Email Sent" : prop.status == "Rejected" ? "Request Rejected" : "Waiting for Approval" } </td>
          </tr>
        );
      } else if (this.props.userRole == "Employee") {
        return (
          <tr onClick={this.toggleVisitationForm.bind(
            this,
            prop.visitorName,
            prop.visitationDate,
            prop.visitorEmail,
            prop.id,
            prop.status,
            prop.remarks
          )} 
          className={prop.status == "Validated" ?  "" : prop.status == "EmailSent" ? "table-row-emailsent": prop.status == "Rejected" ? "table-row-rejected" : "table-row-waiting" } >
          <td> {prop.dateCreated} </td>
          <td> {prop.visitationDate} </td> 
          <td> {prop.visitorName} </td>
          <td> {prop.status == "Validated" ? "Approved" : prop.status == "EmailSent" ? "Check your email for QRcode" : prop.status == "Rejected" ? "Request Rejected" : "Waiting for Approval" } </td>
         </tr>
        );
      } else if (this.props.userRole == "Relative") {
        return (
          <tr onClick={this.toggleVisitationForm.bind(
            this,
            prop.visitorName,
            prop.visitationDate,
            prop.visitorEmail,
            prop.id,
            prop.status,
            prop.remarks
          )} 
          className={prop.status == "Validated" ?  "" : prop.status == "EmailSent" ? "table-row-emailsent": prop.status == "Rejected" ? "table-row-rejected" : "table-row-waiting" } >
          <td> {prop.dateCreated} </td>
          <td> {prop.visitationDate} </td> 
          <td> {prop.visitorName} </td>
          <td> {prop.status == "Validated" ? "Approved" : prop.status == "EmailSent" ? "Check your email for QRcode" : prop.status == "Rejected" ? "Request Rejected" : "Waiting for Approval" } </td>
         </tr>
        );
      }
    })

      if (this.props.userRole == "Admin") {
        return (
          <div className="visitatonView">   
            <Grid fluid className="nopads">
              <Row>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <div className="visitation-cards">
                        <div className="card-header">
                          <span className="visitation-label">Visitation Records</span>
                          {buttonRole()}
                        </div>
                        <div className="card-content">
                          <p className="">
                            <div className="visitationViewTable">
                              <Table striped hover responsive>
                                <thead>
                                  <tr>
                                    <th>Date Created</th>
                                    <th>Visitation Date</th>
                                    <th>Name of Visitor</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {visitorsTable}
                                </tbody>
                              </Table>
                            </div>
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <VisitationForm 
                  showVisitationForm={this.state.showVisitationForm}
                  closeVisitationForm={this.toggleVisitationForm.bind(this)}
                  selectedPatient={this.props.selectedPatient}
                  userData={this.props.userData}
                  userRole={this.props.userRole}
                  firebase={this.props.firebase}
                  selectedVisitor={this.state.selectedVisitor}
                  />
            </Grid>
          </div>
        );
      } else if (this.props.userRole == "Employee") {
        return (
          <div className="visitatonView">   
            <Grid fluid className="nopads">
              <Row>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <div className="visitation-cards">
                        <div className="card-header">
                          <span className="visitation-label">Visitation Records</span>
                          {buttonRole()}
                        </div>
                        <div className="card-content">
                          <p className="">
                            <div className="visitationViewTable">
                              <Table striped hover responsive>
                                <thead>
                                  <tr>
                                    <th>Date Created</th>
                                    <th>Visitation Date</th>
                                    <th>Name of Visitor</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {visitorsTable}
                                </tbody>
                              </Table>
                            </div>
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
                <VisitationForm 
                  showVisitationForm={this.state.showVisitationForm}
                  closeVisitationForm={this.toggleVisitationForm.bind(this)}
                  selectedPatient={this.props.selectedPatient}
                  userData={this.props.userData}
                  userRole={this.props.userRole}
                  firebase={this.props.firebase}
                  selectedVisitor={this.state.selectedVisitor}
                  />
            </Grid>
          </div>
        );
      } else if (this.props.userRole == "Relative") {
        return (
          <div className="visitatonView">   
            <Grid fluid className="nopads">
              <Row>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <div className="visitation-cards">
                        <div className="card-header">
                          <span className="visitation-label">Visitation Records</span>
                          {buttonRole()}
                        </div>
                        <div className="card-content">
                          <p className="">
                            <div className="visitationViewTable">
                              <Table striped hover responsive>
                                <thead>
                                  <tr>
                                    <th>Date Created</th>
                                    <th>Visitation Date</th>
                                    <th>Name of Visitor</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {visitorsTable}
                                </tbody>
                              </Table>
                            </div>
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
                <VisitationForm 
                  showVisitationForm={this.state.showVisitationForm}
                  closeVisitationForm={this.toggleVisitationForm.bind(this)}
                  selectedPatient={this.props.selectedPatient}
                  userData={this.props.userData}
                  userRole={this.props.userRole}
                  firebase={this.props.firebase}
                  selectedVisitor={this.state.selectedVisitor}
                  />
            </Grid>
          </div>
        );
      }
  }
}

export default withFirebase(VisitationView);
