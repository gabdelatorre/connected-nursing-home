import React, { Component } from "react";

import { FirebaseContext } from "../firebase";
import { withFirebase } from "../firebase/context";
import PatientCard from "./PatientCard";

import Modal from "react-responsive-modal";
import ButtonBase from "@material-ui/core/ButtonBase";

class RelativeDashboard extends Component {
  constructor() {
    super();
    this.state = {
      arrOfMyRelative: [],
      tempStorage: {
        firstName: null,
        lastName: null,
        birthdate: null,
        id: null
      }
    };
  }

  onloadMyPatients() {
    console.log("GetMyPatients");
    this.props.firebase.db
      .collection("users")
      .doc(this.props.authUser.uid)
      .collection("relatives")
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
    return (
      <div className="containerRelativeDashboard">
        <div className="containerSectionTitle">
          <h3>My Relatives</h3>
        </div>

        <hr className="style-one" />
        {myPatientsInfo}
      </div>
    );
  }
}

export default withFirebase(RelativeDashboard);
