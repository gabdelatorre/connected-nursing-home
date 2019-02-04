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

class PatientCard extends Component {
  constructor(props) {
    super(props);
  }

  onHandleClick() {}

  render() {
    return (
      <Card className="patientsCardSettings">
        <CardBlock>
          <CardImg
            src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
            alt="Card image cap"
          />
          <CardTitle>
            <b className="nurseCardTitle">
              {this.props.lastName}, {this.props.firstName}
            </b>
          </CardTitle>
          <b className="nurseCardBody">Birthdate:</b> {this.props.birthdate}
        </CardBlock>
        <CardFooter>
          <input type="text" value={this.props.id} hidden />
        </CardFooter>
      </Card>
    );
  }
}

export default withFirebase(PatientCard);
