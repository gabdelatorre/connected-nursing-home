import React, { Component, optionsState } from "react";
import { FirebaseContext } from "../firebase";
import { Table } from "react-bootstrap";
import { withFirebase } from "../firebase/context";
import NurseCard from "./NurseCard";
import {
  FormGroup,
  InputGroup,
  FormControl,
  ControlLabel,
  Button
} from "react-bootstrap";
import Modal from "react-responsive-modal";
import ButtonBase from "@material-ui/core/ButtonBase";

class RelativeAllList extends Component {
  constructor(props) {
    super(props); 
  }

addRelativeToPatient(relativeFirstName, relativeLastName, relativeBirthdate, relativeId) {
  var patientAssign = this.props.selectedPatient.id;
  var relativeId = relativeId;
  this.props.firebase.db
    .collection("users")
    .doc(relativeId)
    .get()
    .then(e => {
      this.props.firebase.db
        .collection("patients")
        .doc(patientAssign)
        .collection("relatives")
        .doc(relativeId)
        .set({
          firstName: e.data().firstName,
          lastName: e.data().lastName,
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
      .doc(relativeId)
      .collection("relatives")
      .doc(e.id)
      .set({
        firstName: e.data().firstName,
        lastName: e.data().lastName,
        birthdate: e.data().birthdate
      });
  });
}
  render() {
    
    const listOfAllRelative = this.props.arrayOfAllRelative.map(Relative => {
      return (
        <div className="itemsPatientCard">
          <ButtonBase
            onClick={() =>
              this.addRelativeToPatient(
                Relative.firstName,
                Relative.lastName,
                Relative.birthdate,
                Relative.id
              )
            }
          >
          <NurseCard
            firstName={Relative.firstName}
            lastName={Relative.lastName}
            id={Relative.id}
          />
          </ButtonBase>
        </div>
      );
    });
    return (
      <div className="health-records-history-view">
        <div className="containerListOfNurses">{listOfAllRelative}</div>
      </div>
    );
  }
}

export default withFirebase(RelativeAllList);
