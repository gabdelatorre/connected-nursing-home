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

class RelativeCard extends Component {
  constructor(props) {
    super(props);
  }

  onHandleClick() {}

  render() {
    return (
      <Card className="patientsCardSettings">
        <CardBlock>
          <CardImg
            src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=150&h=100"
            alt="Card image cap"    
          />
          <CardTitle className="blockTitle">
            <div className="blockTitle">
            <b className="nurseCardTitle">
              {this.props.lastName}, {this.props.firstName}
            </b>
            </div>
          </CardTitle>
        </CardBlock>
        <CardFooter>
          <input type="text" value={this.props.id} hidden />
        </CardFooter>
      </Card>
    );
  }
}

export default withFirebase(RelativeCard);
