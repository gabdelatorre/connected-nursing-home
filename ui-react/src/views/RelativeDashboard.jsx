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
      },
      tempSelectedPatientActivities: [],
    };
    this.setState({
      arrOfMyRelative: []
    });
  }

  routeDirection = (patient) => {
    this.setState({
      selectedPatient: patient
    });
    this.setState({
      tempSelectedPatientActivities: [
          {
              activityName: "Eating",
              activityDate: "2019-02-07",
              activityDesc: "",
              status: "In Progress",
          },
          {
              activityName: "Playing",
              activityDate: "2019-02-07",
              activityDesc: "",
              status: "In Progress",
          }
      ]
  })
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
      this.props.firebase.db
      .collection("users")
      .doc(this.props.authUser.uid)
      .collection("relatives")
      .onSnapshot(e => {
        this.setState({
          arrOfMyRelative: []
        });

        var tempStorage = {};

        e.docs.forEach(data => {
    
      
          this.getPatientInfoFromPatientCollection(data.id);

        
        });
      });

  }

  getPatientInfoFromPatientCollection(id) {
    this.props.firebase.db.collection("patients").doc(id).onSnapshot(data => {
 

      var tempStorage = {};
      console.log(data.data());

        tempStorage = data.data();
        tempStorage = {
          ...tempStorage,
          id: data.id,
        }

        this.setState({
          arrOfMyRelative: this.state.arrOfMyRelative.concat(tempStorage)
        });

        console.log(this.state.arrOfMyRelative);
    

      this.onloadMyPatientsWearables();
    });
  }

  onloadMyPatientsWearables () {
    console.log("onloadMyPatientsWearables");
    var tempState = this.state.arrOfMyRelative.slice();

    tempState.forEach((patient) => {
      this.props.firebase.db
        .collection("patients")
        .doc(patient.id)
        .collection("wearable")
        .onSnapshot(e => {
          e.docs.forEach(e => {

            patient.latestStats = {
              heartRate:e.data().latest.state.reported.HeartRate,
              bloodPressure:e.data().latest.state.reported.BloodPressure,
              timestamp:e.data().latest.state.reported.timestamp,
            }

            this.setState({ arrOfMyRelative:tempState })

          });
        });
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
      console.log("SASA");
      console.log(pat);
      return (
        <div className="itemsPatientCard">
          <ButtonBase
             onClick={() =>
              this.routeDirection(pat)
            }
          >
          <PatientCard
              firstName={pat.firstName}
              lastName={pat.lastName}
              birthdate={pat.birthdate}
              id={pat.id}
              latestStats={pat.latestStats}
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
            <PatientDashboard
              selectedPatient={this.state.selectedPatient}
              selectedPatientVitalStats={this.state.selectedPatient.latestStats}
              userRole="Relative"
              closePatientDashboardView={this.closePatientDashboardView.bind(
                this
              )}
              tempSelectedPatientActivities={this.state.tempSelectedPatientActivities}
            />
        </div>
      );
    } else {
      return (
        <div className="containerRelativeDashboard">
          <div className="containerSectionTitle">
            <h3>My Relatives</h3>
          </div>

          <hr className="style-one" />

          <div className="container-patient-card">{myPatientsInfo}</div>
        </div>
      );
    }
  }
}
export default withRouter(withFirebase(RelativeDashboard));
