import React, { Component } from "react";
import {FormControl, Col, Row, Button} from "react-bootstrap";
import { withFirebase } from './../firebase/context';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

class Login extends Component {

    loginUser () {
        this.props.firebase
            .doSignInWithEmailAndPassword(this.email.value, this.password.value)
            .then(() => {
                console.log("Login success!");
            })
            .catch(error => {
                console.log(error);
            })

    }

    goToRegistration () {
        this.props.history.push('/registration');
    }

    render () {
        return(
        <div>
            <FormControl
              className="inputTextField"
              id="emailTxt"
              type="text"
              bsClass="form-control"
              inputRef={email => this.email = email}
              placeholder="Enter text"
            />
            <br/>
            <FormControl
              className="inputTextField"
              id="passwordTxt"
              type="password"
              bsClass="form-control"
              inputRef={password => this.password = password}
              placeholder="Enter text"
            />
            <br/>
            <Button
              bsStyle="primary"
              type="submit"
              id="loginBtn"
              className="btn-block"
              onClick={this.loginUser.bind(this)}
            >
                Login
            </Button>
            <br/>
            <Button
              bsStyle="primary"
              type="submit"
              id="signUpBtn"
              className="btn-block"
              onClick={this.goToRegistration.bind(this)}
            >
                Sign-up
            </Button>
        </div>
        );
    }
};

export default compose(withRouter, withFirebase)(Login);
