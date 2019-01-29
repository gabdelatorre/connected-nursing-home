import React, { Component, optionsState } from "react";
import { withFirebase } from '../firebase/context';
import {
  Grid,
  Row,
  Col,
  FormControl,
  Dropdown,
  DropdownButton,
  MenuItem,
  Button
} from "react-bootstrap";

class Registration extends Component {

    registerUser () {
        console.log("registerUser");
        const role = document.querySelector("#role");

        this.props.firebase
            .doCreateUserWithEmailAndPassword(this.email.value, this.password.value)
            .then (authUser => {
                console.log(authUser);

                console.log("Name: " + this.firstName.value + " " + this.lastName.value);
                console.log("Role: ", role.value);
                console.log(authUser.user.uid);

                this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        firstName: this.firstName.value,
                        lastName: this.lastName.value,
                        role: role.value
                    })
            })
            .catch (error => {
                console.log(error);
            })
    }

    render() {

        return (
            <Grid>
                <Row className="show-grid">
                    <Col md={4} mdOffset={4}>
                        <div className="account-wall">
                                <Row>
                                    <Col md={12}>
                                        <p className="inputText">Role</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <select
                                          className="form-control inputTextField"
                                          value={optionsState}
                                          id="role"
                                        >
                                            <option value="ADMIN">Admin</option>
                                            <option value="EMPLOYEE">Nursing Home Employee</option>
                                            <option value="RELATIVE">Relative</option>
                                        </select>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <p className="inputText">First Name</p>
                                    </Col>
                                    <Col md={6}>
                                        <p className="inputText">Last Name</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <FormControl
                                          className="inputTextField"
                                          type="text"
                                          bsClass="form-control"
                                          inputRef={firstName => this.firstName = firstName}
                                          placeholder="Juan"
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <FormControl
                                          className="inputTextField"
                                          type="text"
                                          bsClass="form-control"
                                          inputRef={lastName => this.lastName = lastName}
                                          placeholder="Dela Cruz"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <p className="inputText">Email Address: </p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <FormControl
                                          className="inputTextField"
                                          id="emailTxt"
                                          type="text"
                                          bsClass="form-control"
                                          inputRef={email => this.email = email}
                                          placeholder=""
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <p className="inputText">Password: </p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                      <FormControl
                                        className="inputTextField"
                                        id="passwordTxt"
                                        type="password"
                                        bsClass="form-control"
                                        inputRef={password => this.password = password}
                                        placeholder="At least 6 characters"
                                      />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Button
                                          bsStyle="primary"
                                          type="submit"
                                          id="registerBtn"
                                          className="btn-block"
                                          onClick={this.registerUser.bind(this)}
                                        >
                                            Register
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

export default withFirebase(Registration);
