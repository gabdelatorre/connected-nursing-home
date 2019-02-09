import React, { Component, optionsState } from "react";
import { FirebaseContext } from "../firebase";
import { withFirebase } from "../firebase/context";
import PatientCard from "../subviews/PatientCard";

import { Redirect, withRouter } from "react-router-dom";

import {
  FormGroup,
  InputGroup,
  FormControl,
  ControlLabel,
  Button
} from "react-bootstrap";
import Modal from "react-responsive-modal";
import ButtonBase from "@material-ui/core/ButtonBase";
import HealthRecordsView from "../subviews/HealthRecordsView";
import PatientDashboard from "../views/PatientDashboard";

class EmployeeDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmptyMyPatients: false,
      openPatientDashboard: false,
      arrOfMyPatients: [],
      tempStorage: {
        firstName: null,
        lastName: null,
        birthdate: null,
        id: null,
        role: null
      },
      listOfRelatives: [],
      data: {
        firstName: null,
        lastName: null,
        birthdate: null,
        id: null,
        role: null
      },
      buttonRole: "",
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
      heartUpdate: false,
      arePatientVitalStatsLoaded: false,
      arrOfIdsOfMyPatients: {
        firstName: null,
        lastName: null,
        birthdate: null,
        id: null,
        role: null
      },
      idOfPatient: null,
      tempSelectedPatientActivities: [],
    };
  }
  componentDidMount() {
    this.onloadMyPatients();
  }

  onloadMyPatients() {
    console.log("GetMyPatients");
    // this.searchMyPatients({
    //   arrOfMyPatients: []
    // });

    this.props.firebase.db
      .collection("users")
      .doc(this.props.authUser.uid)
      .collection("patients")
      .onSnapshot(e => {
        this.setState({
          arrOfIdsOfMyPatients : [],
          arrOfMyPatients: []
        });

        var tempStorage = {};

        e.docs.forEach(data => {
    
      
          this.getPatientInfoFromPatientCollection(data.id);

        
        });
// console.log(this.state.arrOfIdsOfMyPatients);
        // Object.keys(this.state.arrOfIdsOfMyPatients).map(ids => {

        //   this.getPatientInfoFromPatientCollection(ids);
        // });
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
          arrOfMyPatients: this.state.arrOfMyPatients.concat(tempStorage)
        });

        console.log(this.state.arrOfMyPatients);
    

      this.onloadMyPatientsWearables();
    });
  }

  onloadMyPatientsWearables () {
    console.log("onloadMyPatientsWearables");
    var tempState = this.state.arrOfMyPatients.slice();

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

            this.setState({ arrOfMyPatients:tempState })

          });
        });
    });
  }

  searchMyPatients() {
    var vals = document.getElementById("searchTxtMyPatients").value;
    var dropDownSearch = document.getElementById("searchDropdownMyPatients")
      .value;
    console.log(vals + " SASA " + dropDownSearch);
    if (this.state.isEmptyMyPatients == true && vals == "") {
      console.log(this.state.isEmptyMyPatients);
      this.setState({
        isEmptyMyPatients: false
      });
      this.onloadMyPatients();
    } else if (vals != "") {
      this.setState({
        isEmptyMyPatients: true
      });
      this.setState({
        arrOfMyPatients: []
      });
    }

    this.props.firebase.db
      .collection("users")
      .doc(this.props.authUser.uid)
      .collection("patient")
      .where(dropDownSearch, "==", vals)
      .get()
      .then(e => {
        e.docs.forEach(data => {
          this.setState({
            tempStorage: {
              firstName: data.data().firstName,
              lastName: data.data().lastName,
              birthdate: data.data().birthdate,
              id: data.id,
              role: data.data().role
            }
          });

          this.setState({
            arrOfMyPatients: this.state.arrOfMyPatients.concat(
              this.state.tempStorage
            )
          });
        });

        this.setState({
          tempStorage: {
            firstName: null,
            lastName: null,
            birthdate: null,
            id: null,
            role: null
          }
        });
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

  // ============================================================================================================
  // =========           Employee Dashboard View Button for Patient Dashboard
  // ============================================================================================================
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

  removingOfPatient() {
    var patientId = this.state.data.id;
    var nurseId = this.props.authUser.uid;
    this.props.firebase.db
      .collection("patients")
      .doc(patientId)
      .collection("nurse_assigned")
      .doc(nurseId)
      .delete()
      .then(e => {
        console.log("Delete Successful!");
      });
    this.props.firebase.db
      .collection("users")
      .doc(nurseId)
      .collection("patients")
      .doc(patientId)
      .delete()
      .then(e => {
        console.log("Delete Successful!");
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
    const myPatientsInfo = this.state.arrOfMyPatients.map(pat => {
      console.log("hu:");
      console.log(pat)
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

    const ModalButtons = () => {};

    if (this.state.openPatientDashboard == true) {
      return (
        <div>
            <PatientDashboard
              selectedPatient={this.state.selectedPatient}
              selectedPatientVitalStats={this.state.selectedPatient.latestStats}
              userRole="Employee"
              closePatientDashboardView={this.closePatientDashboardView.bind(
                this
              )}
              tempSelectedPatientActivities={this.state.tempSelectedPatientActivities}
              authUser={this.props.authUser}
            />
        </div>
      );
    } else {
      return (
        <div className="employee-dashboard-view">
          <section id="My Patients">
            <div className="containerSection">
              <div className="items">
                <h3>My Patients</h3>
              </div>
            </div>
          </section>

          <div className="containerSectionSearch">
            {/* <div className="items">
              <FormGroup>
                <FormControl
                  componentClass="select"
                  id="searchDropdownMyPatients"
                >
                  <option value="firstName">First Name</option>
                  <option value="lastName">Last Name</option>
                </FormControl>
              </FormGroup>
            </div>
            <div className="items">
              <FormGroup>
                <InputGroup>
                  <FormControl
                    type="text"
                    id="searchTxtMyPatients"
                    onChange={this.searchMyPatients.bind(this)}
                  />
                </InputGroup>
              </FormGroup>
            </div> */}
          </div>
          <hr className="style-one" />

          <div className="container-patient-card">{myPatientsInfo}</div>
        </div>
      );
    }
  }
}

export default withRouter(withFirebase(EmployeeDashboard));
