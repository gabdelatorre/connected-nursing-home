import React, { Component } from 'react';
import { Grid, Row, Col, Glyphicon } from 'react-bootstrap';
import Avatar from 'react-avatar';

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

    setAction (action) {
        this.props.setAction(action);
    }

    render() {
        
        return (
            <div className={"activity-info-block "  + (this.state.activityClicked ? "activity-info-block-clicked" : "")} 
                 onClick={this.setActivityClicked.bind(this)}>
                <Grid fluid>
                    <Row>
                        <Col lg={2} md={2} sm={2} xs={2}>
                            <Glyphicon glyph="apple" className="activityicon"/>
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={4}>
                            <div className="activity-block-info">
                                <h4 className="activity-header">{this.props.activity.activityName}</h4>
                                <h4 className="activity-header-2">{this.props.activity.activityDate}</h4>
                            </div>
                        </Col>
                        <div className="activity-complete-btn" onClick={this.setAction.bind(this, "COMPLETE")}>
                            Complete
                        </div>
                        <div className="activity-delete-btn" onClick={this.setAction.bind(this, "DELETE")}>
                            Delete
                        </div>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default ActivityPlannedItem;
