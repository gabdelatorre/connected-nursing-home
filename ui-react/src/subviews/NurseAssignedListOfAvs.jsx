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
  constructor() {
    super();
    this.state = {
      tempStorageOfData: {
        firstName: null,
        lastName: null,
        id: null
      },
      arrayOfNurses: []
    };
  }

  componentDidMount() {
    this.getNursesFromDatabase();
  }

  getNursesFromDatabase() {
    this.props.firebase.db
      .collection("users")
      .where("role", "==", "EMPLOYEE")
      .get()
      .then(e => {
        e.docs.forEach(data => {
          this.setState({
            tempStorageOfData: {
              firstName: data.data().firstName,
              lastName: data.data().lastName,
              id: data.id
            },
            arrayOfNurses: this.state.arrayOfNurses.concat(
              this.state.tempStorageOfData
            )
          });

          console.log(data.data());
        });
      });

    this.setState({
      tempStorageOfData: {
        firstName: null,
        lastName: null,
        id: null
      }
    });
  }

  render() {
    const listOfNurse = this.state.arrayOfNurses.map(Nurses => {
      return (
        <div className="itemsPatientCard">
          {/* <ButtonBase
            onClick={() =>
              this.routeDirection(
                Nurses.firstName,
                Nurses.lastName,
                Nurses.birthdate,
                Nurses.id
              )
            }
          > */}
          <NurseCard
            firstName={Nurses.firstName}
            lastName={Nurses.lastName}
            id={Nurses.id}
          />
          {/* </ButtonBase> */}
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
