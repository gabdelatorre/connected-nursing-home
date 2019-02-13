import React, { Component, optionsState } from "react";

import { FirebaseContext } from "../firebase";
import { withFirebase } from "../firebase/context";
import {
  FormGroup,
  InputGroup,
  FormControl,
  Button,
  ControlLabel
} from "react-bootstrap";
import Modal from "react-responsive-modal";
import ButtonBase from "@material-ui/core/ButtonBase";
import PatientCard from "../subviews/PatientCard";
import { Redirect, withRouter } from "react-router-dom";
import PatientDashboard from "../views/PatientDashboard";
import PatientForm from "../subviews/PatientForm";

class NursingHomeDashboard extends Component {
  constructor() {
    super();

    this.state = {
      arrOfAllPatients: [],
      isEmptyAllPatients: false,
      open: false,
      arrOfNurses: [],
      allPatientsId: [],
      tempStorage: {
        firstName: null,
        lastName: null,
        birthdate: null,
        id: null
      },
      openPatientDashboard: null,
      listOfRelatives: [],
      data: {
        firstName: null,
        lastName: null,
        birthdate: null,
        id: null
      },
      selectedPatient: {
        firstName: null,
        lastName: null,
        birthdate: null,
        id: null
      },
      selectedPatientVitalStats: {
        weight: null,
        height: null,
        bloodPressure: null,
        temperature: null,
        heartRate: null
      },
      selectedPatientStatsHistory: [],
      selectedPatientBloodPressureHistory: [],
      buttonRole: null,
      areAllPatientsLoaded: false,
      arePatientVitalStatsLoaded: false,
      tempSelectedPatientActivities: [],
      showPatientForm: false,
    };
    
  }

  componentDidMount() {
    //  this.fillNurseList();
    this.fillRelativeList();
    this.onloadAllPatients();
    this.fillNurseListPop();
    console.log(this.props);
  }

  openPatientProfile = (passFirstName, passLastName, passBirthdate, passId) => {
    this.setState({
      selectedPatient: {
        firstName: passFirstName,
        lastName: passLastName,
        birthdate: passBirthdate,
        id: passId
      },
      selectedPatientVitalStats: {
        weight: "1",
        height: "2",
        bloodPressure: "3",
        temperature: "4",
        heartRate: "5"
      },
    });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
      data: {
        firstName: null,
        lastName: null,
        birthdate: null,
        id: null
      }
    });
  };

  fillRelativeList() {
    this.props.firebase.db
      .collection("users")
      .where("role", "==", "RELATIVE")
      .get()
      .then(e => {
        e.docs.forEach(data => {
          this.setState({
            tempStorage: {
              firstName: data.data().firstName,
              lastName: data.data().lastName,
              birthdate: data.data().birthdate,
              id: data.id
            }
          });
          this.setState({
            listOfRelatives: this.state.listOfRelatives.concat(
              this.state.tempStorage
            )
          });
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
  }

  fillNurseListPop() {
    this.setState({
      data: {
        firstName: null,
        lastName: null,
        birthdate: null,
        id: null
      }
    });

    let html = "";
    const dropDown = document.querySelector(".nurseId");
    this.props.firebase.db
      .collection("users")
      .where("role", "==", "EMPLOYEE")
      .get()
      .then(e => {
        e.docs.forEach(data => {
          this.setState({
            data: {
              firstName: data.data().firstName,
              lastName: data.data().lastName,
              birthdate: data.data().birthdate,
              id: data.id
            }
          });

          this.setState({
            arrOfNurses: this.state.arrOfNurses.concat(this.state.data)
          });
        });
      });

    this.setState({
      data: {
        firstName: null,
        lastName: null,
        birthdate: null,
        id: null
      }
    });
  }

  onloadAllPatients() {
    this.props.firebase.patients().onSnapshot(e => {
      console.log("onloadAllPatients snapShot");
      this.setState({
        arrOfAllPatients: []
      });

      var tempStorage = {};

      e.docs.forEach(data => {
        console.log(data.data());

        tempStorage = data.data()
        tempStorage = {
          ...tempStorage,
          id: data.id,
        }

        this.setState({
          arrOfAllPatients: this.state.arrOfAllPatients.concat(tempStorage)
        });

        console.log(this.state.arrOfAllPatients);

        if (this.state.selectedPatient.id === tempStorage.id) {
          this.setState({ selectedPatient: tempStorage }, () => {
              console.log(this.state.selectedPatient);
          })
        }
      });
    });
  }

  searchAllPatients() {
    var vals = document.getElementById("searchTxtAllPatients").value;

    var dropDownSearch = document.getElementById("searchDropdownAllPatients")
      .value;

    if (this.state.isEmptyAllPatients == true && vals == "") {
      this.setState({
        isEmptyAllPatients: false
      });

      this.onloadAllPatients();
    } else if (vals != "") {
      this.setState({
        isEmptyAllPatients: true
      });

      this.setState({
        arrOfAllPatients: []
      });
    }

    this.props.firebase
      .patients()
      .where(dropDownSearch, "==", vals)
      .get()
      .then(e => {
        e.docs.forEach(data => {
            var tempStorage = data.data()
            tempStorage = {
              ...tempStorage,
              id: data.id,
            }

            this.setState({
              arrOfAllPatients: this.state.arrOfAllPatients.concat(tempStorage)
            });

            console.log(this.state.arrOfAllPatients);
        });
      });
  }

  addPatientToRelative() {
    var relativeId = document.getElementById("relativeList").value;
    var patientId = this.state.data.id;
    this.props.firebase.db
      .collection("patients")
      .doc(patientId)
      .get()
      .then(e => {
        this.props.firebase.db
          .collection("users")
          .doc(relativeId)
          .collection("relatives")
          .doc(patientId)
          .set({
            firstName: e.data().firstName,
            lastName: e.data().lastName,
            birthdate: e.data().birthdate
          });
      });

    this.props.firebase.db
      .collection("users")
      .doc(relativeId)
      .get()
      .then(e => {
        alert("Connecting Patient and Relative successfully");
        this.props.firebase.db
          .collection("patients")
          .doc(patientId)
          .collection("relatives")
          .doc(relativeId)
          .set({
            firstName: e.data().firstName,
            lastName: e.data().lastName
          });
      });
  }

  removePatientAccount() {
    var patientId = this.state.data.id;
    this.props.firebase.db
      .collection("patients")
      .doc(patientId)
      .delete()
      .then(e => {
        console.log("Delete Successful!");
      });
  }

  addPatient() {
    var patientAssign = this.state.data.id;
    var nurseIds = document.getElementById("showNurses").value;
    this.props.firebase.db
      .collection("users")
      .doc(nurseIds)
      .get()
      .then(e => {
        this.props.firebase.db
          .collection("patients")
          .doc(patientAssign)
          .collection("nurse_Assigned")
          .doc(nurseIds)
          .set({
            firstName: e.data().firstName,
            lastName: e.data().lastName,
            role: e.data().role
          });
      });
    console.log(patientAssign + " ASASA");
    this.props.firebase.db
      .collection("patients")
      .doc(patientAssign)
      .get()
      .then(e => {
        console.log(e.data());
        this.props.firebase.db
          .collection("users")
          .doc(nurseIds)
          .collection("patients")
          .doc(e.id)
          .set({
            firstName: e.data().firstName,
            lastName: e.data().lastName,
            birthdate: e.data().birthdate,
            role: e.data().role
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
                activityName: "Breakfast",
                activityDate: "2019-02-07",
                activityDesc: "",
                status: "In Progress",
            },
            {
                activityName: "Arts Class",
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

    this.onloadAllPatients();
  }

  togglePatientForm () {

    if (this.state.showPatientForm) {
        this.setState({
            showPatientForm: false
        })
    }
    else {
        this.setState({
            showPatientForm: true
        })
    }
  }

  render() {
    const listOfRelativesUser = this.state.listOfRelatives.map(rel => {
      return <option value={rel.id}>{rel.firstName}</option>;
    });

    // const listOfNurseUser = this.state.listOfNurse.map(nurse => {
    //   return <option value={nurse.id}>{nurse.firstName}</option>;
    // });

    const { openPatientDashboard } = this.state;

    var allPatientsInfo = [];
    
    // if (this.state.areAllPatientsLoaded) {
      allPatientsInfo = this.state.arrOfAllPatients.map(pat => {
        return (
          <div className="items-patient-card">
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
                nurseAssigned="SampleText"
              />
            </ButtonBase>
          </div>
        );
      });
    // }

    const nurseListPop = this.state.arrOfNurses.map(nurse => {
      return <option value={nurse.id}>{nurse.firstName}</option>;
    });

    if (this.state.openPatientDashboard == true) {
      return (
        <div>
            <PatientDashboard
              selectedPatient={this.state.selectedPatient}
              selectedPatientVitalStats={this.state.selectedPatient.latestStats}
              userRole="Admin"
              closePatientDashboardView={this.closePatientDashboardView.bind(
                this
              )}
              selectedPatientStatsHistory={this.state.selectedPatient.statsHistory}
              tempSelectedPatientActivities={this.state.tempSelectedPatientActivities}
              authUser={this.props.authUser}
              userData={this.props.userData}
            />
        </div>
      );
    } else {
      return (
        <div className="nursing-home-dashboard-view">
          <div className="header-section">
            <h3>Nursing Home Patients</h3>
          </div>
          <div className="view-content">
          <div className="search-bar-section">
            <div className="bar-dropdown">
                <FormControl
                  componentClass="select"
                  id="searchDropdownAllPatients"
                >
                  <option value="firstName">First Name</option>

                  <option value="lastName">Last Name</option>
                </FormControl>
            </div>

            <div className="bar-search">
                  <FormControl
                    type="text"
                    id="searchTxtAllPatients"
                    onChange={this.searchAllPatients.bind(this)}
                  />
            </div>

            <div className="bar-btns">
              <Button
                bsStyle="primary"
                type="submit"
                id="signUpBtn"
                className="bar-action-btn"
                onClick={this.togglePatientForm.bind(this)}
              >
                Create Patient
              </Button>
            </div>
          </div>
          <div className="container-patient-card">{allPatientsInfo}</div>
        </div>

        <PatientForm
            showPatientForm={this.state.showPatientForm}
            closePatientForm={this.togglePatientForm.bind(this)}
        />
        </div>
      );
    }
  }
}

export default withRouter(withFirebase(NursingHomeDashboard));
