import React, { Component } from "react";
import { FormControl, Col, Row, Button, Grid } from "react-bootstrap";
import { withFirebase } from "./../firebase/context";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

class Login extends Component {
  loginUser() {
    this.props.firebase
      .doSignInWithEmailAndPassword(this.email.value, this.password.value)
      .then(() => {
        console.log("Login success!");
      })
      .catch(error => {
        console.log(error);
      });
  }

  goToRegistration() {
    this.props.history.push("/registration");
  }

  render() {
    return (
      <Grid>
        <Row className="show-grid">
          <Col md={4} mdOffset={4}>
            <div className="account-wall">
              <Row>
                <Col md={12}>
                  <p className="inputText">Email Address </p>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormControl
                    className="inputTextField"
                    id="emailTxt"
                    type="text"
                    bsClass="form-control"
                    inputRef={email => (this.email = email)}
                    placeholder="JuanDelaCruz@gmail.com"
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <p className="inputText">Password </p>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormControl
                    className="inputTextField"
                    id="passwordTxt"
                    type="password"
                    bsClass="form-control"
                    inputRef={password => (this.password = password)}
                    placeholder="Password"
                  />
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Button
                    bsStyle="primary"
                    type="submit"
                    id="loginBtn"
                    className="btn-block"
                    onClick={this.loginUser.bind(this)}
                  >
                    Login
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <p className="inputText text-center">or </p>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Button
                    bsStyle="primary"
                    type="submit"
                    id="signUpBtn"
                    className="btn-block"
                    onClick={this.goToRegistration.bind(this)}
                  >
                    Sign-up
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default compose(
  withRouter,
  withFirebase
)(Login);
