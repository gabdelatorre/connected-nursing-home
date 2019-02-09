import React, { Component, optionsState } from "react";
import { FirebaseContext } from "../firebase";
import { Table } from "react-bootstrap";
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

class HealthRecordsHistory extends Component {

    constructor() {
        super();
        this.state = {
        };
    }

    componentDidMount() {
    }

    toggleModal (record) {
        this.props.toggleHealthExaminationRecord(record);
    }

    render() {

        var healthRecords = this.props.healthRecords.map((prop) => {
            return (    
                <tr onClick={this.toggleModal.bind(this, prop)}>
                    <td> {prop.timestamp} </td>
                    <td> {prop.nurseInCharge} </td> 
                </tr>
            )
        })

        return (
            <div className="health-records-history-view">
                <Table striped hover responsive>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Doctor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {healthRecords}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default withFirebase(HealthRecordsHistory);
