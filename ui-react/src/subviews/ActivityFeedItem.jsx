import React, { Component, optionsState } from "react";
import { FirebaseContext } from "../firebase";
import { withFirebase } from "../firebase/context";
import PatientCard from "./PatientCard";
import {
  FormGroup,
  InputGroup,
  FormControl,
  ControlLabel,
  Row,
  Glyphicon,
  Col,
  Button
} from "react-bootstrap";
import Modal from "react-responsive-modal";
import ButtonBase from "@material-ui/core/ButtonBase";
import moment from "moment";

class ActivityFeedItem extends Component {

    constructor() {
        super();
        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {

        return (
            <div className="activity-feed-item">
                <Row>
                    <Col lg={8}>
                        <p className="activitydesc"> <b>{this.props.selectedPatient.firstName + " " + this.props.selectedPatient.lastName} </b> engaged in <b>{this.props.activity.activityName}</b> </p>
                    </Col>
                    <Col lg={4}>
                        <p className="activitytime"> {moment.unix(this.props.activity.activityDateCompleted.seconds)
                          .format("lll")} </p>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withFirebase(ActivityFeedItem);
