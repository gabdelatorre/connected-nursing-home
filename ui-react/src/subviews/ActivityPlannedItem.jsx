import React, { Component } from 'react';
import { Grid, Row, Col, Glyphicon } from 'react-bootstrap';
import Avatar from 'react-avatar';
import moment from "moment";

class ActivityPlannedItem extends Component {

    constructor () {
        super();
        this.state = {
            activityClicked: false
        }
    }

    setActivityClicked (user) {
        if (this.state.activityClicked) {
            this.setState({
                activityClicked: false
            })
        }
        else {
            this.setState({
                activityClicked: true
            })
        }
    }

    setAction (action, activity) {
        this.props.setAction(action, activity);
    }

    render() {
        
        return (
            <div className={"activity-info-block "  + (this.state.activityClicked ? "activity-info-block-clicked" : "")} 
                 onClick={this.setActivityClicked.bind(this)}>
                <Grid fluid>
                    <Row>
                        <Col lg={8} md={8} sm={8} xs={8}>
                            <div className="activity-block-info">
                                <h4 className="activity-header-2">{moment.unix(this.props.activity.activityDate.seconds).format("lll")}</h4>
                                <h4 className="activity-header">{this.props.activity.activityName}</h4>
                            </div>
                        </Col>
                        <div className="activity-complete-btn act-btn" onClick={this.setAction.bind(this, "COMPLETE", this.props.activity)}>
                            <Glyphicon glyph="ok-sign"/>
                        </div>
                        <div className="activity-delete-btn act-btn" onClick={this.setAction.bind(this, "REMOVE", this.props.activity)}>
                            <Glyphicon glyph="remove-sign"/>
                        </div>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default ActivityPlannedItem;
