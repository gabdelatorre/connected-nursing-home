import React, { Component } from "react";
import { withFirebase } from "../firebase/context";
import {
  Card,
  CardBlock,
  CardFooter,
  CardTitle,
  CardText,
  CardImg
} from "react-bootstrap-card";
import {
  Grid, Row, Col, Glyphicon
} from "react-bootstrap";
import samplepic from "../assets/images/sample-patient.jpg";
import { thermometer_icon } from "../assets/icons/icons";

class PatientCard extends Component {
  constructor(props) {
    super(props);
  }

  onHandleClick() {}

  render() {

    var heartAnimation = {
      animation:
        "anim-heart-beat " +
        60 / parseFloat(this.props.latestStats.heartRate) +
        "s infinite"
    };

    return (
      <Card className="patient-card">
        <CardBlock>
          <div className="patient-pic-section">
            <img src={samplepic} className="profilepic" />
          </div>
          <CardTitle>
            <b>
              {this.props.firstName + " " + this.props.lastName}
            </b>
          </CardTitle>
          <hr/>
          <div className="vital-stats-section">
            <Grid fluid>
              <Row>
                <Col className="nopads" lg={4} md={4} sm={4} xs={4}>
                  <div className="vital-stat-right">
                    <Glyphicon glyph="heart" className="vital-stats-heart" style={heartAnimation}/>
                    {this.props.latestStats.heartRate}
                  </div>
                </Col>

                <Col className="nopads" lg={4} md={4} sm={4} xs={4}>
                  <div className="vital-stat-right">
                    <img src={thermometer_icon} className="vital-stats-temp"/>
                    {this.props.latestStats.temperature}
                  </div>
                </Col>

                <Col className="nopads" lg={4} md={4} sm={4} xs={4}>
                  <div className="vital-stat"> 
                    <Glyphicon glyph="tint" className="vital-stats-bp"/>
                    {this.props.latestStats.bloodPressure}
                  </div>
                </Col>
              </Row>
            </Grid>
          </div>
        </CardBlock>
        <CardFooter>
          <input type="text" value={this.props.id} hidden/>
        </CardFooter>
      </Card>
    );
  }
}

export default withFirebase(PatientCard);
