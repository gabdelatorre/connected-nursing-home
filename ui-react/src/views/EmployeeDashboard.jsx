import React, { Component, optionsState } from "react";
import { FirebaseContext } from "../firebase";
import { withFirebase } from "../firebase/context";
import PatientCard from "./PatientCard";

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
import PatientDashboard from "../views/PatientDashboard";

class EmployeeDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrOfAllPatients: [],
      isEmptyAllPatients: false,
      isEmptyMyPatients: false,
      open: false,
      arrOfMyPatients: [],
      allPatientsId: [],
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
      buttonRole: ""
    };
  }
  componentDidMount() {
    // this.onloadAllPatients();
    this.onloadMyPatients();
  }

  onloadMyPatients() {
    console.log("GetMyPatients");
    this.searchMyPatients({
      arrOfMyPatients: []
    });

    this.props.firebase.db
      .collection("users")
      .doc(this.props.authUser.uid)
      .collection("patients")
      .onSnapshot(e => {
        this.setState({
          arrOfMyPatients: []
        });
        e.docs.forEach(data => {
          console.log(data.data());
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
        console.log(this.state.arrOfMyPatients);
      });
  }

  onloadAllPatients() {
    this.props.firebase.patients().onSnapshot(e => {
      this.setState({
        arrOfMyPatients: []
      });
      e.docs.forEach(data => {
        console.log(data.data());
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
          id: null,
          role: null
        }
      });
    });
  }

  addPatientToMyPatient() {
    var patientAssign = this.state.data.id;
    this.props.firebase.db
      .collection("users")
      .doc(this.props.authUser.uid)
      .get()
      .then(e => {
        this.props.firebase.db
          .collection("patients")
          .doc(patientAssign)
          .collection("nurse_Assigned")
          .doc(this.props.authUser.uid)
          .set({
            firstName: e.data().firstName,
            lastName: e.data().lastName,
            role: e.data().role
          });
      });

    this.props.firebase.db
      .collection("patients")
      .doc(patientAssign)
      .get()
      .then(e => {
        console.log(e.data());
        this.props.firebase.db
          .collection("users")
          .doc(this.props.authUser.uid)
          .collection("patients")
          .doc(e.id)
          .set({
            firstName: e.data().firstName,
            lastName: e.data().lastName,
            birthdate: e.data().birthdate,
            role: e.data().role
          });
      });

    this.onCloseModal();
  }

  onOpenModal = (
    passFirstName,
    passLastName,
    passBirthdate,
    passId,
    passRole,
    patientLocation
  ) => {
    this.setState({
      open: true,
      data: {
        firstName: passFirstName,
        lastName: passLastName,
        birthdate: passBirthdate,
        id: passId,
        role: passRole
      }
    });

    if (patientLocation == "myPatient") {
      this.setState({
        buttonRole: (
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
        )
      });
    } else {
      this.setState({
        buttonRole: (
          <p className="modalBodyText">
            <Button
              bsStyle="primary"
              type="submit"
              id="loginBtn"
              className="btn-block"
              onClick={this.addPatientToMyPatient.bind(this)}
            >
              Add to my Patient
            </Button>
          </p>
        )
      });
    }
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

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

  searchAllPatients() {
    var vals = document.getElementById("searchTxtAllPatients").value;
    var dropDownSearch = document.getElementById("searchDropdownAllPatients")
      .value;

    if (this.state.isEmptyAllPatients == true && vals == "") {
      console.log(this.state.isEmptyAllPatients);
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
          console.log(data.id);
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
            id: null,
            role: null
          }
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

    this.onCloseModal();
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
      open: true,
      data: {
        firstName: passFirstName,
        lastName: passLastName,
        birthdate: passBirthdate,
        id: passId,
        role: passRole
      }
    });

    this.props.history.push({
      pathname: "/pdashboard",
      state: {
        data: this.state.data
      }
    });
  };

  render() {
    const allPatientsInfo = this.state.arrOfAllPatients.map(pat => {
      return (
        <div className="itemsPatientCard">
          <ButtonBase
            onClick={() =>
              this.onOpenModal(
                pat.firstName,
                pat.lastName,
                pat.birthdate,
                pat.id,
                pat.role,
                "allPatient"
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

    const myPatientsInfo = this.state.arrOfMyPatients.map(pat => {
      return (
        <div className="itemsPatientCard">
          <ButtonBase onClick={() => this.routeDirection()}>
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

    const { open } = this.state;

    const ModalButtons = () => {};

    return (
      <div className="EmployeeDashboard">
        <section id="My Patients">
          <div className="containerSection">
            <div className="items">
              <h3>My Patients</h3>
            </div>
          </div>
        </section>

        <div className="containerSectionSearch">
          <div className="items">
            <FormGroup controlId="formControlsSelect">
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
          </div>
        </div>
        <hr className="style-one" />

        <div className="containerPatientCard">{myPatientsInfo}</div>

        <Modal
          className="settingsModal"
          open={open}
          onClose={this.onCloseModal}
          center
        >
          <div className="modalResponsive">
            <h2>
              <b>Profile of {this.state.data.firstName}</b>
            </h2>
            <div className="containerModal">
              <div className="itemsModal pictureItem">
                <div className="containerModalPicture">
                  <div className="itemsModal pictureItem">
                    <img src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" />
                  </div>
                </div>
              </div>

              <div className="itemsModal">
                <div className="containerModalBody">
                  <div className="itemsModal">
                    <p className="modalBodyText">
                      <b>First Name:</b> {this.state.data.firstName}{" "}
                    </p>
                  </div>

                  <div className="itemsModal">
                    <p className="modalBodyText">
                      <b>Last name:</b> {this.state.data.lastName}
                    </p>
                  </div>

                  <div className="itemsModal">
                    <p className="modalBodyText">
                      <b>Birthdate:</b> {this.state.data.birthdate}{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="containerVitalStatistic">
              <div className="itemsModal">
                <p className="modalBodyText">
                  <b>Height:</b> 53.54
                </p>
              </div>

              <div className="itemsModal">
                <p className="modalBodyText">
                  <b>Weight:</b> 53.54
                </p>
              </div>

              <div className="itemsModal">
                <p className="modalBodyText">
                  <b>Blood Pressure:</b> 53.54
                </p>
              </div>

              <div className="itemsModal">
                <p className="modalBodyText">
                  <b>Temperature:</b> 53.54
                </p>
              </div>
            </div>

            <div className="containerModalButtons">
              <div className="itemsModal" id="buttonRole">
                {this.state.buttonRole}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(withFirebase(EmployeeDashboard));
