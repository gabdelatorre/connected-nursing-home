import React, { Component } from "react";

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
import PatientCard from "./PatientCard";

class NursingHomeDashboard extends Component {
  constructor() {
    super();
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
        id: null
      },
      listOfRelatives: [],
      data: {
        firstName: null,
        lastName: null,
        birthdate: null,
        id: null
      }
    };
  }

  componentDidMount() {
    this.fillNurseList();
    this.fillRelativeList();
    // this.fillPatientList();
    this.onloadAllPatients();
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

  fillRelativeList() {
    this.props.firebase.db
      .collection("users")
      .where("role", "==", "RELATIVE")
      .get()
      .then(e => {
        e.docs.forEach(data => {
          this.setState({
            listOfRelatives: this.state.listOfRelatives.concat(data.data())
          });

          console.log(this.state.listOfRelatives + " SASAS");
        });
      });
  }

  fillNurseList() {
    let html = "";
    const dropDown = document.querySelector(".nurseId");
    this.props.firebase.db
      .collection("users")
      .where("role", "==", "EMPLOYEE")
      .get()
      .then(e => {
        html += <option value="empty"> N/A </option>;
        e.docs.forEach(data => {
          const list = `
                    <option value="${data.id}">${data.data().firstName} ${
            data.data().lastName
          }</option>
                `;

          html += list;
        });
        dropDown.innerHTML = html;
      });
  }

  fillPatientList() {
    const dropDown = document.querySelector(".patientId");
    this.props.firebase.db.collection("patients").onSnapshot(e => {
      let html = "";
      e.docs.forEach(data => {
        const list = `
                    <option value="${data.id}">${data.data().firstName} ${
          data.data().lastName
        }</option>
                `;

        html += list;
      });
      dropDown.innerHTML = html;
    });
  }

  showDate() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var millisec = date.getMilliseconds();

    var dateToday =
      month +
      "/" +
      day +
      "/" +
      year +
      " " +
      hour +
      ":" +
      min +
      ":" +
      sec +
      ":" +
      millisec;
    console.log(dateToday);
  }
  getDate() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var millisec = date.getMilliseconds();

    var dateToday =
      month +
      "/" +
      day +
      "/" +
      year +
      " " +
      hour +
      ":" +
      min +
      ":" +
      sec +
      ":" +
      millisec;
    return dateToday;
  }

  getVal(id) {
    return document.getElementById(id).value;
  }

  setVal(id, data) {
    document.getElementById(id).value = data;
  }

  searchCheckUp() {
    var patientId = "TCM87SJ7yFb4Edv6E4Jh";
    var date = document.querySelector("#dateTxt").value;

    this.props.firebase.db
      .collection("patients")
      .doc(patientId)
      .collection("vital_statistics")
      .where("timestamps", "==", date)
      .get()
      .then(data => {
        data.docs.forEach(data => {
          this.setVal("bloodPressure", data.data().blood_pressure);
          this.setVal("height", data.data().height);
          this.setVal("weight", data.data().weight);
          this.setVal("temperature", data.data().temperature);
          this.setVal("remarks", data.data().remarks);
        });
      });
  }

  register() {
    var firstNames = this.getVal("firstName");
    var lastNames = this.getVal("lastName");
    var birthdate = this.getVal("birthdate");
    var nurseAssign = this.getVal("nurseChoice");
    var docs = "x";
    console.log(nurseAssign);
    if (nurseAssign == "empty") {
      this.props.firebase.db
        .collection("patients")
        .add({
          birthdate: birthdate,
          firstName: firstNames,
          lastName: lastNames
        })
        .then(docRef => {});
    } else {
      this.props.firebase.db
        .collection("patients")
        .add({
          birthdate: birthdate,
          firstName: firstNames,
          lastName: lastNames
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
                  lastName: e.data().firstName
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
                  firstName: firstNames,
                  lastName: lastNames
                })
                .then(e => {
                  console.log("Successful");
                });
            });
        });
    }
  }

  addPatient() {
    var patientAssign = this.getVal("patientChoice");
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
            lastName: e.data().lastName
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
            lastName: e.data().lastName
          });
      });
  }

  getVitals() {
    var patientId = "TCM87SJ7yFb4Edv6E4Jh";
    this.props.firebase.db
      .collection("patients")
      .doc(patientId)
      .collection("vital_statistics")
      .onSnapshot(e => {
        e.docs.forEach(data => {
          console.log(data.id);
          console.log(new Date());
          console.log(data.data());
        });
      });
  }

  setVitals() {
    var patientId = "TCM87SJ7yFb4Edv6E4Jh";
    var checkupData = "1Fr7VHZk1qkK9LWhCy6Q";
    this.props.firebase.db
      .collection("patients")
      .doc(patientId)
      .collection("vital_statistics")
      .doc(checkupData)
      .onSnapshot(data => {
        console.log(data.data());
        this.setVal("bloodPressure", data.data().blood_pressure);
        this.setVal("height", data.data().height);
        this.setVal("weight", data.data().weight);
        this.setVal("temperature", data.data().temperature);
        this.setVal("remarks", data.data().remarks);
      });
  }

  checkUp() {
    var patientId = "TCM87SJ7yFb4Edv6E4Jh";

    var bloodPressure = this.getVal("bloodPressure");
    var height = this.getVal("height");
    var weight = this.getVal("weight");
    var temperature = this.getVal("temperature");
    var remarks = this.getVal("remarks");
    var date = this.getDate();

    this.props.firebase.db
      .collection("patients")
      .doc(patientId)
      .collection("vital_statistics")
      .add({
        timestamps: date,
        blood_pressure: bloodPressure,
        height: height,
        weight: weight,
        temperature: temperature,
        remarks: remarks,
        nurseId: this.props.authUser.uid
      })
      .then(e => {
        console.log("Success");
      });
  }

  deleteCheckUp() {
    var patientId = "TCM87SJ7yFb4Edv6E4Jh";
    var checkupData = "1Fr7VHZk1qkK9LWhCy6Q";

    this.props.firebase.db
      .collection("patients")
      .doc(patientId)
      .collection("vital_statistics")
      .doc(checkupData)
      .delete()
      .then(e => {
        console.log("Delete Successful!");
        this.getVitals();
      });
  }

  editCheckUp() {
    var patientId = "TCM87SJ7yFb4Edv6E4Jh";
    var checkupData = "1Fr7VHZk1qkK9LWhCy6Q";

    var bloodPressure = this.getVal("bloodPressure");
    var height = this.getVal("height");
    var weight = this.getVal("weight");
    var temperature = this.getVal("temperature");
    var remarks = this.getVal("remarks");
    var date = this.getDate();

    this.props.firebase.db
      .collection("patients")
      .doc(patientId)
      .collection("vital_statistics")
      .doc(checkupData)
      .set({
        timestamps: date,
        blood_pressure: bloodPressure,
        height: height,
        weight: weight,
        temperature: temperature,
        remarks: remarks,
        nurseId: this.props.authUser.uid
      })
      .then(e => {
        console.log("Edit Successful!");
        this.getVitals();
      });
  }

  onloadAllPatients() {
    this.props.firebase
      .patients()
      .get()
      .then(e => {
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

  render() {
    const dropdownOptionsNurses = () => {};

    const listOfRelativesUser = this.state.listOfRelatives.map(rel => {
      return <option>{rel.firstName} </option>;
    });

    const { open } = this.state;

    const allPatientsInfo = this.state.arrOfAllPatients.map(pat => {
      return (
        <div className="itemsPatientCard">
          <ButtonBase
            onClick={() =>
              this.onOpenModal(
                pat.firstName,
                pat.lastName,
                pat.birthdate,
                pat.id
              )
            }
          >
            <PatientCard
              firstName={pat.firstName}
              lastName={pat.lastName}
              birthdate={pat.birthdate}
              id={pat.id}
              nurseAssigned="SampleText"
            />
          </ButtonBase>
        </div>
      );
    });

    return (
      <div className="NursingHomeDashboard">
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
                onClick={this.register.bind(this)}
              >
                Create
              </Button>
            </div>
          </div>
        </div>

        <hr className="style-one" />

        <section id="allPatients">
          <div className="containerSection">
            <div className="items">
              <h3>All Patients</h3>
            </div>
          </div>
        </section>
        <div className="containerSectionSearch">
          <div className="items">
            <FormGroup controlId="formControlsSelect">
              <FormControl
                componentClass="select"
                id="searchDropdownAllPatients"
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
                  id="searchTxtAllPatients"
                  onChange={this.searchAllPatients.bind(this)}
                />
              </InputGroup>
            </FormGroup>
          </div>
        </div>

        <hr className="style-one" />
        <div className="containerPatientCard">{allPatientsInfo}</div>

        <div className="modalResponsive">
          <Modal open={open} onClose={this.onCloseModal} center>
            <h2>
              <b>Profile of {this.state.data.firstName}</b>
            </h2>
            <div className="containerModalPicture">
              <div className="itemsModal">
                <img src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" />
              </div>
            </div>

            <div className="containerModal">
              <div className="itemsModal">
                <p className="modalBodyText">
                  <b>Name:</b>
                </p>
              </div>
              <div className="itemsModal">
                <p className="modalBodyText">
                  {this.state.data.firstName} {this.state.data.lastName}
                </p>
              </div>
            </div>
            <div className="containerModal">
              <div className="itemsModal">
                <p className="modalBodyText">
                  <b>Birthdate:</b>
                </p>
              </div>
              <div className="itemsModal">
                <p className="modalBodyText">{this.state.data.birthdate}</p>
              </div>

              <div className="containerModal">
                <div className="itemsModal">
                  <p className="modalBodyText">
                    <b>Vital Statistics:</b>
                  </p>
                </div>
                <div className="itemsModal">
                  <p className="modalBodyText" />
                </div>
              </div>

              <div className="containerModal">
                <div className="itemsModal">
                  <p className="modalBodyText">
                    <b>Height: </b> 53.54
                  </p>
                </div>

                <div className="itemsModal">
                  <p className="modalBodyText">
                    <b>Weight:</b> 53.54
                  </p>
                </div>
              </div>
              <div className="itemsModal">
                <p className="modalBodyText">
                  <b>Blood Pressure:</b> 53.54
                </p>
              </div>
              <div className="itemsModal">
                <p className="modalBodyText">
                  <b>Temperature: </b> 53.54
                </p>
              </div>
            </div>

            <div className="containerModal">
              <div className="itemsModal">
                <p className="modalBodyText">
                  <Button
                    bsStyle="primary"
                    type="submit"
                    id="loginBtn"
                    className="btn-block"
                    onClick={this.addPatient.bind(this)}
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
                >
                  {listOfRelativesUser}
                </FormControl>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default withFirebase(NursingHomeDashboard);
