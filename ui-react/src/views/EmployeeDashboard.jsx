import React, { Component, optionsState } from "react";
import { FirebaseContext } from "../firebase";
import { withFirebase } from "../firebase/context";
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

class EmployeeDashboard extends Component {
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
    this.fillRelativeList();
    this.onloadAllPatients();
    this.onloadMyPatients();
  }

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

  onloadMyPatients() {
    console.log("GetMyPatients");
    this.searchAllPatients({
      arrOfMyPatients: []
    });

    this.props.firebase.db
      .collection("users")
      .doc(this.props.authUser.uid)
      .collection("patients")
      .onSnapshot(e => {
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
            id: null
          }
        });
        console.log(this.state.arrOfMyPatients);
      });
  }

  addPatient() {
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

    this.setState({
      arrOfMyPatients: []
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
              id: data.id
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
    const listOfRelativesUser = this.state.listOfRelatives.map(rel => {
      return <option>{rel.firstName} </option>;
    });

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

    const myPatientsInfo = this.state.arrOfMyPatients.map(pat => {
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

    const { open } = this.state;
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
                    Add to my Patient
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

export default withFirebase(EmployeeDashboard);
