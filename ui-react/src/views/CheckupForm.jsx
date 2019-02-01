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

class CheckupForm extends Component {

    constructor() {
        super();
        this.state = {
        };
    }

    componentDidMount() {
        this.onloadAllPatients();
        this.onloadMyPatients();
    }

    searchCheckUp(){
        var patientId = "KEr41uK5SZOmwy5Fd1CZ";
        var date = document.querySelector('#dateTxt').value;
        var newDate = new Date(date);
        var finalDate = newDate.getMonth()+1 + "-" + newDate.getDate() + "-" + newDate.getFullYear();
        console.log(finalDate);

        this.props.firebase.db.collection("patients").doc(patientId).collection("vital_statistics").where("timestamps", "==", finalDate).get().then( data =>{
            data.docs.forEach(data=>{
                this.setVal("bloodPressure", data.data().blood_pressure);
                this.setVal("height", data.data().height);
                this.setVal("weight", data.data().weight);
                this.setVal("temperature", data.data().temperature);
                this.setVal("remarks", data.data().remarks);
            }) 
        });

        this.props.firebase.db.collection("patients").onSnapshot(e=>{
            e.docs.forEach(e=>{
                this.props.firebase.db.collection("patients").doc(e.id).collection("vital_statistics").where("timestamps", "==", finalDate).get().then( data =>{
                    data.docs.forEach(data=>{
                        console.log(data.data())
                    }) 
                });
            })
        })
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

export default withFirebase(CheckupForm);
