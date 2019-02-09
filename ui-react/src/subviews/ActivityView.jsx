
import moment from 'moment';
import React, { Component, optionsState } from "react";
import { FirebaseContext } from "../firebase";
import { withFirebase } from "../firebase/context";
import { Grid, Row, Col, Glyphicon } from "react-bootstrap";
import samplepic from "../assets/images/sample-patient.jpg";

import PatientCard from "./PatientCard";
import {
  FormGroup,
  InputGroup,
  FormControl,
  ControlLabel,
  Button
} from "react-bootstrap";
import ActivityFeedItem from "./ActivityFeedItem";
import ActivityPlannedItem from './ActivityPlannedItem';
import ActivityForm from './ActivityForm';

class ActivityView extends Component {

    constructor() {
        super();
        this.state = {
            showActivityForm: false,
        };
    }

    componentDidMount() {
        console.log("ActivityView: componentDidMount");
        console.log(this.props.selectedPatient);
        console.log(this.props.firebase);
    }

    toggleActivityForm () {

        if (this.state.showActivityForm) {
            this.setState({
                showActivityForm: false,
            })
        }
        else {
            this.setState({
                showActivityForm: true,
            })
        }
    }

    completeActivity (activity) {
        // TODO
    }

    removeActivity (activity) {
        // TODO
    }

    setActivityAction (action, activity) {
        console.log(action);

        if (action === "COMPLETE") {
            this.completeActivity(activity);
        }
        else if (action === "REMOVE") {
            this.removeActivity(activity);
        }
    }

    render() {

        const buttonRole = () => {
            if(this.props.userRole == "Relative") {
                
            } else {
           return <Button className="header-option-btn" onClick={this.toggleActivityForm.bind(this)}><Glyphicon glyph="plus"/></Button>
            }
        }
        
        var tempActivityMap = this.props.activityFeed.map((activity) => {
            console.log("ActivityFeed: ");
            console.log(activity);
            return (
                <ActivityFeedItem selectedPatient={this.props.selectedPatient} activity={activity}/>
            )
        })

        var tempPlannedActivityMap = this.props.plannedActivities.map((activity) => {
            console.log("PlannedActivity: ");
            console.log(activity);
            return (
                <div className="activity-block">
                <ActivityPlannedItem selectedPatient={this.props.selectedPatient} activity={activity} setAction={this.setActivityAction.bind(this)}/>
                </div>
            )
        })
        
        return (
            <div className="activity-view">
                <Grid fluid className="nopads">
                    <Row>
                        <Col lg={12} md={12} sm={12} xs={12}>
                            <Row>
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <div>
                                    <div className="planned-activities-card">
                                        <div className="card-header">
                                            <span className="card-label"> Planned Activities </span>
                                            {buttonRole()}
                                        </div>
                                        <div className="card-content">
                                            {tempPlannedActivityMap}
                                        </div>
                                    </div>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <div>
                                        <div className="planned-activities-card">
                                          <div className="card-header">
                                            <span className="card-label">
                                              Activity Feed
                                            </span>
                                          </div>
                                          <div className="activity-feed">
                                            {tempActivityMap}
                                          </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <ActivityForm
                        showActivityForm={this.state.showActivityForm}
                        closeActivityForm={this.toggleActivityForm.bind(this)}
                        selectedPatient={this.props.selectedPatient}
                    />

                </Grid>
            </div>
        );
    }
}

export default withFirebase(ActivityView);
