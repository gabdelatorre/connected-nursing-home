import React, { Component, optionsState } from "react";
import { FirebaseContext } from "../firebase";
import { Table } from "react-bootstrap";
import { withFirebase } from "../firebase/context";
import RelativeCard from "./RelativeCard";
import {
  FormGroup,
  InputGroup,
  FormControl,
  ControlLabel,
  Button
} from "react-bootstrap";
import Modal from "react-responsive-modal";
import ButtonBase from "@material-ui/core/ButtonBase";

class VisitationRelativeListOfPatient extends Component {
  constructor(props) {
    super(props);
  }



  render() {
    const listOfPatientRelative = this.props.arrayOfPatientRelative.map(Relative => {
      return (
        <div className="itemsPatientCard">
        <ButtonBase
          
        >
        <RelativeCard
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
        <RelativeCard
          firstName={Relative.firstName}
          lastName={Relative.lastName}
          id={Relative.id}
        />
      </div>
      );
    });
    
    if (this.props.userRole == "Admin") {
    return (
      <div className="visitatonView">
        <div className="containerListOfRelatives">{listOfPatientRelative}</div>
      </div>
    );
  } else if (this.props.userRole == "Employee") {
    return (
      <div className="visitatonView">
        <div className="containerListOfRelatives">{listOfPatientRelativeForNurseRole}</div>
      </div>
    );
  }
  }
}

export default withFirebase(VisitationRelativeListOfPatient);
