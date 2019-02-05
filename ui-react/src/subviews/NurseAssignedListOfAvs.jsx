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

class NurseAssignedListOfAvs extends Component {
  constructor(props) {
    super(props); 
    this.state ={
      arrayOfNurses:[]
    }
    this.setState  ({
      arrayOfNurses: this.props.arrayOfNursesAvailable
    })
  }

componentDidMount() {
  


}

addNurseToPatient(nurseFirstName, nurseLastName, nurseId) {
  var patientAssign = this.props.selectedPatient.id;
  var nurseIds = nurseId;
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
        });
    });
}
  render() {
    
    const listOfNurse = this.props.arrayOfNursesAvailable.map(Nurses => {
      return (
        <div className="itemsPatientCard">
          <ButtonBase
            onClick={() =>
              this.addNurseToPatient(
                Nurses.firstName,
                Nurses.lastName,
                Nurses.id
              )
            }
          >
          <NurseCard
            firstName={Nurses.firstName}
            lastName={Nurses.lastName}
            id={Nurses.id}
          />
          </ButtonBase>
        </div>
      );
    });
    return (
      <div className="health-records-history-view">
        <div className="containerListOfNurses">{listOfNurse}</div>
      </div>
    );
  }
}

export default withFirebase(NurseAssignedListOfAvs);
