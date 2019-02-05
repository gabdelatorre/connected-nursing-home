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
      buttonRole: null,
      areAllPatientsLoaded: false,
      arePatientVitalStatsLoaded: false
    };
  }

  componentDidMount() {
    //  this.fillNurseList();
    this.fillRelativeList();
    this.onloadAllPatients();
    this.fillNurseListPop();
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
      buttonRole: (
        <div>
          <div className="itemsModal">
            <p className="modalBodyText">
              <Button
                bsStyle="primary"
                type="submit"
                id="loginBtn"
                className="btn-block"
                onClick={this.addPatientToRelative.bind(this)}
              >
                Add Relative
              </Button>
            </p>
          </div>

          <div className="itemsModal">
            <ControlLabel>Relative List</ControlLabel>
            <FormControl
              componentClass="select"
              className="relativeList"
              id="relativeList"
              placeholder="select"
              value={optionsState}
            >
              {/* {listOfRelativesUser} */}
            </FormControl>
          </div>

          <div className="itemsModal">
            <p className="modalBodyText">
              <Button
                bsStyle="primary"
                type="submit"
                id="loginBtn"
                className="btn-block"
                onClick={this.removePatientAccount.bind(this)}
              >
                Remove Patient Account
              </Button>
            </p>
          </div>
          <div className="itemsModal">
            <p className="modalBodyText">
              <Button
                bsStyle="primary"
                type="submit"
                id="loginBtn"
                className="btn-block"
                onClick={this.addPatient.bind(this)}
              >
                AddPatient to nurse
              </Button>
            </p>
          </div>
          <div className="formItems">
            <ControlLabel>Nurse List</ControlLabel>
            <FormControl
              componentClass="select"
              className="showNurses"
              id="showNurses"
              placeholder="select"
              value={optionsState}
            >
              {/* {nurseListPop} */}
            </FormControl>
          </div>
        </div>
      )
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

  //   fillNurseList() {
  //     let html = "";
  //     const dropDown = document.querySelector(".nurseId");
  //     this.props.firebase.db
  //       .collection("users")
  //       .where("role", "==", "EMPLOYEE")
  //       .get()
  //       .then(e => {
  //         html += <option value="empty"> N/A</option>;
  //         e.docs.forEach(data => {
  //           const list = `
  // <option value="${data.id}">${data.data().firstName}
  // ${data.data().lastName}</option>
  // `;
  //           html += list;
  //         });
  //         dropDown.innerHTML = html;
  //       });
  //   }

  patientRegistration() {
    var firstNames = document.getElementById("firstName").value;
    var lastNames = document.getElementById("lastName").value;
    var birthdate = document.getElementById("birthdate").value;
    var nurseAssign = document.getElementById("nurseChoice").value;
    var role = "Patient";
    var docs = "x";
    if (nurseAssign == "empty") {
      this.props.firebase.db
        .collection("patients")
        .add({
          birthdate: birthdate,
          firstName: firstNames,
          lastName: lastNames,
          role: role
        })
        .then(docRef => {});
    } else {
      this.props.firebase.db
        .collection("patients")
        .add({
          birthdate: birthdate,
          firstName: firstNames,
          lastName: lastNames,
          role: role
        })

        .then(docRef => {
          this.props.firebase.db
            .collection("users")
            .doc(nurseAssign)
            .get()
            .then(e => {
              this.props.firebase.db
                .collection("patients")
                .doc("" + docRef.id)
                .collection("nurse_Assigned")
                .doc(nurseAssign)
                .set({
                  firstName: e.data().lastName,
                  lastName: e.data().firstName,
                  role: e.data().role
                })
                .then(e => {
                  console.log("Successful");
                });

              this.props.firebase.db
                .collection("users")
                .doc("" + nurseAssign)
                .collection("patients")
                .doc(docRef.id)

                .set({
                  birthdate: birthdate,
                  firstName: firstNames,
                  lastName: lastNames,
                  role: role
                })

                .then(e => {
                  console.log("Successful");
                });
            });
        });
    }
  }

  // addPatientToMyPatient() {

  // var patientAssign = this.state.data.id;

  // var nurseAssign =

  // this.props.firebase.db

  // .collection("users")

  // .doc(this.props.authUser.uid)

  // .get()

  // .then(e => {

  // this.props.firebase.db

  // .collection("patients")

  // .doc(patientAssign)

  // .collection("nurse_Assigned")

  // .doc(this.props.authUser.uid)

  // .set({

  // firstName: e.data().firstName,

  // lastName: e.data().lastName,

  // role: e.data().role

  // });

  // });

  // this.props.firebase.db

  // .collection("patients")

  // .doc(patientAssign)

  // .get()

  // .then(e => {

  // console.log(e.data());

  // this.props.firebase.db

  // .collection("users")

  // .doc(this.props.authUser.uid)

  // .collection("patients")

  // .doc(e.id)

  // .set({

  // firstName: e.data().firstName,

  // lastName: e.data().lastName,

  // birthdate: e.data().birthdate,

  // role: e.data().role

  // });

  // });

  // }

  onloadAllPatients() {
    this.props.firebase.patients().onSnapshot(e => {
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
      });

      this.onloadAllWearables();
    });

    // this.props.firebase.db
    //   .collection("patients")
    //   .doc(patientId)
    //   .collection("wearable")
    //   .onSnapshot(e => {
    //     e.docs.forEach(e => {
    //       this.setState({
    //         selectedPatientVitalStats: e.data().latest.state.reported,
    //         heartUpdate: true,
    //         arePatientVitalStatsLoaded: true
    //       });
    //     });
    //   });
  }

  onloadAllWearables () {
    console.log("onloadAllWearables");
    var tempState = this.state.arrOfAllPatients.slice();

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

            this.setState({ arrOfAllPatients:tempState })
          });
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
          this.setState({
            tempStorage: {
              firstName: data.data().firstName,
              lastName: data.data().lastName,
              birthdate: data.data().birthdate,
              id: data.id
            }
          });

          this.setState({
            arrOfAllPatients: this.state.arrOfAllPatients.concat(
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

  // relativeRegister() {

  // const role = "Relative";

  // var email = document.getElementById("emailRelative").value;

  // var password = document.getElementById("passwordRelative").value;

  // this.props.firebase

  // .doCreateUserWithEmailAndPassword(email, password)

  // .then(authUser => {

  // console.log(authUser);

  // console.log(

  // "Name: " +

  // this.firstNameRelative.value +

  // " " +

  // this.lastNameRelative.value

  // );

  // this.props.firebase.user(authUser.user.uid).set({

  // firstName: this.firstNameRelative.value,

  // lastName: this.lastNameRelative.value,

  // role: role.value

  // });

  // })

  // .catch(error => {

  // console.log(error);

  // });

  // }

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
      buttonRole: (
        <div className="itemsModal" id="buttonRole">
          <p className="modalBodyText">
            <Button
              bsStyle="primary"
              type="submit"
              id="loginBtn"
              className="btn-block"
              onClick={this.removingOfPatient.bind(this)}
            >
              Remove this
            </Button>
          </p>
        </div>
      ),
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
        console.log(pat)
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
            />
        </div>
      );
    } else {
      return (
        <div className="nursing-home-dashboard-view">
          <div className="header-section">
            <h3>Nursing Home Dashboard</h3>
          </div>

          <div className="dashboard-card">
            hi
          </div>

          <div className="header-section">
            <h3>Nursing Home Patients</h3>
          </div>

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
              >
                Create Patient
              </Button>
            </div>
          </div>
          <div className="container-patient-card">{allPatientsInfo}</div>

          {/* <Modal
            className="settingsModal"
            open={open}
            onClose={this.onCloseModal}
            center
          >
            <div className="modalResponsive">
              <h2>
                <b>Patient Creation</b>
              </h2>

              <div className="containerModal">
                <div className="form">
                  <div className="formCreation">
                    <div className="formItems">
                      <h4>Patient Registration</h4>
                    </div>

                    <div className="formItems">
                      <ControlLabel>First Name</ControlLabel>

                      <FormControl
                        className="inputTextField"
                        id="firstName"
                        type="text"
                        bsClass="form-control"
                      />
                    </div>

                    <div className="formItems">
                      <ControlLabel>Last Name</ControlLabel>

                      <FormControl
                        className="inputTextField"
                        id="lastName"
                        type="text"
                        bsClass="form-control"
                      />
                    </div>

                    <div className="formItems">
                      <ControlLabel>Birthdate</ControlLabel>

                      <FormControl
                        className="inputTextField"
                        id="birthdate"
                        type="date"
                        bsClass="form-control"
                      />
                    </div>

                    <div className="formItems">
                      <ControlLabel>Nurse List</ControlLabel>

                      <FormControl
                        componentClass="select"
                        className="nurseId"
                        id="nurseChoice"
                        placeholder="select"
                      >
                        <option value="">N/A</option>
                      </FormControl>
                    </div>

                    <div className="formItems">
                      <Button
                        bsStyle="primary"
                        type="submit"
                        id="loginBtn"
                        className="btn-block"
                        onClick={this.patientRegistration.bind(this)}
                      >
                        Create
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="containerModalButtons" />
            </div>
          </Modal> */}
        </div>
      );
    }
  }
}

export default withRouter(withFirebase(NursingHomeDashboard));
