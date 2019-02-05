import moment from "moment";
import React, { Component, optionsState } from "react";
import { FirebaseContext } from "../firebase";
import { withFirebase } from "../firebase/context";
import { Grid, Row, Col, Glyphicon } from "react-bootstrap";
import samplepic from "../assets/images/sample-patient.jpg";
import NurseAssignedListOfAvs from "./NurseAssignedListOfAvs";
import NurseAssignedListOfMyNurse from "./NurseAssignedListOfMyNurse";
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
class NurseAssignedListOfAvailable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tempStorageOfData: {
        firstName: null,
        lastName: null,
        id: null
      },
      arrayOfNursesAvailable: [],
      arrayOfNursesTaken: []
    };
    this.toggleNurses();
  }

  componentWillMount() {
    

  }

  searchCheckUp() {
    var patientId = "KEr41uK5SZOmwy5Fd1CZ";
    var date = document.querySelector("#dateTxt").value;
    var newDate = new Date(date);
    var finalDate =
      newDate.getMonth() +
      1 +
      "-" +
      newDate.getDate() +
      "-" +
      newDate.getFullYear();
    console.log(finalDate);

    this.props.firebase.db
      .collection("patients")
      .doc(patientId)
      .collection("vital_statistics")
      .where("timestamps", "==", finalDate)
      .get()
      .then(data => {
        data.docs.forEach(data => {
          this.setVal("bloodPressure", data.data().bloodPressure);
          this.setVal("height", data.data().height);
          this.setVal("weight", data.data().weight);
          this.setVal("temperature", data.data().temperature);
          this.setVal("remarks", data.data().remarks);
        });
      });

    this.props.firebase.db.collection("patients").onSnapshot(e => {
      e.docs.forEach(e => {
        this.props.firebase.db
          .collection("patients")
          .doc(e.id)
          .collection("vital_statistics")
          .where("timestamps", "==", finalDate)
          .get()
          .then(data => {
            data.docs.forEach(data => {
              console.log(data.data());
            });
          });
      });
    });
  }

  goBack() {
    this.props.switchDashboardView("DASHBOARD");
  }

  toggleHealthExaminationForm() {
    if (this.state.showHealthExaminationForm) {
      this.setState({
        showHealthExaminationForm: false
      });
    } else {
      this.setState({
        showHealthExaminationForm: true
      });
    }
  }

  setHealthStatGraph(healthstat) {
    this.setState({
      selectedHealthStatGraph: healthstat
    });
  }

  toggleHealthExaminationRecord(record) {
    if (this.state.showHealthExaminationRecord) {
      this.setState({
        showHealthExaminationRecord: false,
        selectedHealthExaminationRecord: null
      });
    } else {
      this.setState({
        showHealthExaminationRecord: true,
        selectedHealthExaminationRecord: record
      });
    }
  }



  toggleNurses(){
    
    var patientId = this.props.selectedPatient.id;
    this.props.firebase.db.collection("patients").doc(patientId).collection("nurse_Assigned").onSnapshot(e =>{
      this.setState({
        tempStorageOfData: {
          firstName: null,
          lastName: null,
          id: null
        },
        arrayOfNursesTaken: []
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
            arrayOfNursesTaken: this.state.arrayOfNursesTaken.concat(
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
   

this.splitTakenAndAvailableNurse();
}

splitTakenAndAvailableNurse() {
 
  this.props.firebase.db
  .collection("users")
  .where("role", "==", "EMPLOYEE")
  .get()
  .then(e => {
    e.docs.forEach(data => {
      this.setState({
        tempStorageOfData: {
          firstName: data.data().firstName,
          lastName: data.data().lastName,
          id: data.id
        },
      });

      if (this.state.arrayOfNursesTaken.includes(this.state.tempStorageOfData)) {
       
        this.setState({
          tempStorageOfData: {
            firstName: null,
            lastName: null,
            id: null
          }
        });
      } else {
        
      this.setState ({
        arrayOfNursesAvailable: this.state.arrayOfNursesAvailable.concat(
          this.state.tempStorageOfData
        )
      });

    }


    });    
  });
  


}


  render() {
    if (this.props.userRole == "Admin") {
    return (
      <div className="nurse-assigned-view">
        <Grid fluid className="nopads">
        <Row>
            <Col lg={12}>
              <Row>
                <Col lg={12}>
                  <div>
                    <div className="my-nurses-card">
                      <div className="card-header">
                        <span className="card-label">
                          {" "}
                          Nurses Assigned{" "}
                        </span>
                      </div>
                      <div className="card-content">
                        <Row>
                          <Col lg={12}>
                            <NurseAssignedListOfMyNurse view="Nurse-Assigned" selectedPatient={this.props.selectedPatient} arrayOfNursesTaken={this.state.arrayOfNursesTaken} userRole={this.props.userRole} />
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>


          <Row>
            <Col lg={12}>
              <Row>
                <Col lg={12}>
                  <div>
                    <div className="list-of-nurses-card">
                      <div className="card-header">
                        <span className="card-label">
                          {" "}
                          List of Available Nurses{" "}
                        </span>
                      </div>
                      <div className="card-content">
                        <Row>
                          <Col lg={12}>
                            <NurseAssignedListOfAvs view="Nurse-Available" selectedPatient={this.props.selectedPatient} arrayOfNursesAvailable={this.state.arrayOfNursesAvailable} userRole={this.props.userRole} />
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  } else {
    return (
      <div className="nurse-assigned-view">
        <Grid fluid className="nopads">
        <Row>
            <Col lg={12}>
              <Row>
                <Col lg={12}>
                  <div>
                    <div className="my-nurses-card">
                      <div className="card-header">
                        <span className="card-label">
                          {" "}
                          Nurses Assigned{" "}
                        </span>
                      </div>
                      <div className="card-content">
                        <Row>
                          <Col lg={12}>
                            <NurseAssignedListOfMyNurse view="Nurse-Assigned" selectedPatient={this.props.selectedPatient} arrayOfNursesTaken={this.state.arrayOfNursesTaken} userRole={this.props.userRole} />
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
        </div>
          );
  }
}
}

export default withFirebase(NurseAssignedListOfAvailable);
