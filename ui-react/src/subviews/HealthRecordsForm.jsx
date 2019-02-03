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

class HealthRecordsForm extends Component {

    constructor() {
        super();
        this.state = {
        };
    }

    componentDidMount() {
    }

    
    checkUp(){
        var patientId = this.getVal("patientChoice3");

        var bloodPressure = this.getVal("bloodPressure");
        var height = this.getVal("height");
        var weight = this.getVal("weight");
        var temperature = this.getVal("temperature");
        var remarks = this.getVal("remarks");
        var date = this.getDate();

        this.props.firebase.db.collection("patients").doc(patientId).collection("vital_statistics").add({
            timestamps: date,
            blood_pressure: bloodPressure,
            height: height,
            weight: weight,
            temperature: temperature,
            remarks: remarks,
            nurseId: this.props.authUser.uid
        }).then(e=>{
            console.log("Success");
        });
    } 

    render() {

        return (
            <div className="checkup-view">
                
            </div>
        );
    }
}

export default withFirebase(HealthRecordsForm);
