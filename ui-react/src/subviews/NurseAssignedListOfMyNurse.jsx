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
  }

  componentDidMount() {

  }


  removingOfPatient(nurseFirstName, nurseLastName, nurseId) {
    
    var patientId = this.props.selectedPatient.id;
    var nurseId = nurseId;
    
    this.props.firebase.db
      .collection("patients")
      .doc(patientId)
      .collection("nurse_Assigned")
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

  render() {
    const listOfNurse = this.props.arrayOfNursesTaken.map(Nurses => {
      return (
        <div className="itemsPatientCard">
        <ButtonBase
          onClick={() =>
            this.removingOfPatient(
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

    const listOfNurseForRelativeRole = this.props.arrayOfNursesTaken.map(Nurses => {
      return (
        <div className="itemsPatientCard">
        <NurseCard
          firstName={Nurses.firstName}
          lastName={Nurses.lastName}
          id={Nurses.id}
        />
      </div>
      );
    });
    if (this.props.userRole == "Admin") {
    return (
      <div className="health-records-history-view">
        <div className="containerListOfNurses">{listOfNurse}</div>
      </div>
    );
  } else {
    return (
      <div className="health-records-history-view">
        <div className="containerListOfNurses">{listOfNurseForRelativeRole}</div>
      </div>
    );
  }
  }
}

export default withFirebase(NurseAssignedListOfAvs);
