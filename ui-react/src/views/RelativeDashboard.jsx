import React, { Component } from "react";

import { FirebaseContext } from "../firebase";
import { withFirebase } from "../firebase/context";
import PatientCard from "../subviews/PatientCard";

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
      open: false,
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

  render() {
    const myPatientsInfo = this.state.arrOfMyRelative.map(pat => {
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
      <div className="containerRelativeDashboard">
        <div className="containerSectionTitle">
          <h3>My Relatives</h3>
        </div>

        <hr className="style-one" />

        <div className="containerPatientCard">{myPatientsInfo}</div>

        <div className="modalResponsive">
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
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default withFirebase(RelativeDashboard);
