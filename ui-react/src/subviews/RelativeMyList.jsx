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

class RelativeMyList extends Component {
  constructor(props) {
    super(props);
  }


  removingOfRelative(relativeFirstName, relativeLastName, relativeBirthdate, relativeId) {
    
    var patientId = this.props.selectedPatient.id;
    var relativeId = relativeId;
    
    this.props.firebase.db
      .collection("patients")
      .doc(patientId)
      .collection("relatives")
      .doc(relativeId)
      .delete()
      .then(e => {
        console.log("Delete Successful!");
      });
    this.props.firebase.db
      .collection("users")
      .doc(relativeId)
      .collection("relatives")
      .doc(patientId)
      .delete()
      .then(e => {
        console.log("Delete Successful!");
      });
  }

  render() {
    const listOfPatientRelative = this.props.arrayOfPatientRelative.map(Relative => {
      return (
        <div className="itemsPatientCard">
        <ButtonBase
          onClick={() =>
            this.removingOfRelative(
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

    const listOfPatientRelativeForNurseRole = this.props.arrayOfPatientRelative.map(Relative => {
      return (
        <div className="itemsPatientCard">
        <NurseCard
          firstName={Relative.firstName}
          lastName={Relative.lastName}
          id={Relative.id}
        />
      </div>
      );
    });
    
    if (this.props.userRole == "Admin") {
    return (
      <div className="health-records-history-view">
        <div className="containerListOfNurses">{listOfPatientRelative}</div>
      </div>
    );
  } else {
    return (
      <div className="health-records-history-view">
        <div className="containerListOfNurses">{listOfPatientRelativeForNurseRole}</div>
      </div>
    );
  }
  }
}

export default withFirebase(RelativeMyList);
