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

    render() {

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
                        <tr>
                            <td> 1/22/2019 </td>
                            <td> John Doe </td>
                        </tr>
                        <tr>
                            <td> 1/31/2019 </td>
                            <td> Jane Doe </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default withFirebase(HealthRecordsHistory);
