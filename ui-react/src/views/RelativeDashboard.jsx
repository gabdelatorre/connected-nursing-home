import React, { Component } from "react";

import { FirebaseContext } from "../firebase";
import { withFirebase } from "../firebase/context";
import PatientCard from "../subviews/PatientCard";

import { Redirect, withRouter } from "react-router-dom";
import PatientDashboard from "../views/PatientDashboard";

import Modal from "react-responsive-modal";
import ButtonBase from "@material-ui/core/ButtonBase";
import {
  FormGroup,
  InputGroup,
  FormControl,
  ControlLabel,
  Button
} from "react-bootstrap";

class RelativeDashboard extends Component {
  constructor() {
    super();
    this.state = {
      arrOfMyRelative: [],
      openPatientDashboard: false,
      selectedPatient: {
        firstName: null,
        lastName: null,
        birthdate: null,
        id: null,
        role: null
      },
      selectedPatientVitalStats: {
        weight: null,
        height: null,
        bloodPressure: null,
        temperature: null,
        heartRate: null
      },
      tempStorage: {
        firstName: null,
        lastName: null,
        birthdate: null,
        id: null
      },
      data: {
        firstName: null,
        lastName: null,
        birthdate: null,
        id: null
      }
    };
    this.setState({
      arrOfMyRelative: []
    });
  }

  routeDirection = (
    passFirstName,
    passLastName,
    passBirthdate,
    passId,
    passRole,
    patientLocation
  ) => {
    this.setState({
      selectedPatient: {
        firstName: passFirstName,
        lastName: passLastName,
        birthdate: passBirthdate,
        id: passId,
        role: passRole
      }
    });
    this.getAllPatientRecord(passId);
    this.setState({
      openPatientDashboard: true
    });
  };

  getAllPatientRecord(passedId) {
    var patientId = passedId;

    this.setState({ arePatientVitalStatsLoaded: false });

    this.props.firebase.db
      .collection("patients")
      .doc(patientId)
      .collection("vital_statistics")
      .onSnapshot(e => {
        e.docs.forEach(e => {
          this.setState({
            selectedPatientVitalStats: {
              weight: e.data().weight,
              height: e.data().height
            }
          });
        });
      });
    this.props.firebase.db
      .collection("patients")
      .doc(patientId)
      .collection("wearable")
      .onSnapshot(e => {
        e.docs.forEach(e => {
          this.setState({
            selectedPatientVitalStats: e.data().latest.state.reported,
            heartUpdate: true,
            arePatientVitalStatsLoaded: true
          });
        });
      });
  }

  onOpenModal = (passFirstName, passLastName, passBirthdate, passId) => {
    this.setState({
      open: true,
      data: {
        firstName: passFirstName,
        lastName: passLastName,
        birthdate: passBirthdate,
        id: passId
      }
    });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    this.onloadMyPatients();
  }

  onloadMyPatients() {
    console.log("GetMyPatients");
    this.props.firebase.db
      .collection("users")
      .doc(this.props.authUser.uid)
      .collection("relatives")
      .onSnapshot(e => {
        this.setState({
          arrOfMyRelative: []
        });
        e.docs.forEach(data => {
          console.log(data.data());
          this.setState({
            tempStorage: {
              firstName: data.data().firstName,
              lastName: data.data().lastName,
              birthdate: data.data().birthdate,
              id: data.id
            }
          });

          this.setState({
            arrOfMyRelative: this.state.arrOfMyRelative.concat(
              this.state.tempStorage
            )
          });
        });

        this.setState({
          tempStorage: {
            firstName: null,
            lastName: null,
            birthdate: null,
            id: null
          }
        });
        console.log(this.state.arrOfMyRelative);
      });
  }

  goToMedicalRecords(data) {
    this.setState({
      currentView: "MEDICAL_RECORDS",
      selectedPatient: data
    });
  }

  closePatientDashboardView() {
    this.setState({
      openPatientDashboard: false
    });
  }

  render() {
    const myPatientsInfo = this.state.arrOfMyRelative.map(pat => {
      return (
        <div className="itemsPatientCard">
          <ButtonBase
            onClick={() =>
              this.routeDirection(
                pat.firstName,
                pat.lastName,
                pat.birthdate,
                pat.id,
                pat.role,
                "myPatient"
              )
            }
          >
            <PatientCard
              firstName={pat.firstName}
              lastName={pat.lastName}
              birthdate={pat.birthdate}
              id={pat.id}
              nurseAssigned={pat.role}
            />
          </ButtonBase>
        </div>
      );
    });

    const { openPatientDashboard } = this.state;

    if (this.state.openPatientDashboard == true) {
      return (
        <div>
          {this.state.arePatientVitalStatsLoaded && (
            <PatientDashboard
              selectedPatient={this.state.selectedPatient}
              selectedPatientVitalStats={this.state.selectedPatientVitalStats}
              userRole="Relative"
              closePatientDashboardView={this.closePatientDashboardView.bind(
                this
              )}
            />
          )}
        </div>
      );
    } else {
      return (
        <div className="containerRelativeDashboard">
          <div className="containerSectionTitle">
            <h3>My Relatives</h3>
          </div>

          <hr className="style-one" />

          <div className="containerPatientCard">{myPatientsInfo}</div>
        </div>
      );
    }
  }
}
export default withRouter(withFirebase(RelativeDashboard));
