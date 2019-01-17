import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import { NavItem, Nav, NavDropdown, MenuItem } from 'react-bootstrap';


class HeaderLinks extends Component{

    initiateLogout () {
        //this.props.logout();
    }

    render(){
        const notification = (
            <div>
                <i className="fa fa-globe"></i>
                <b className="caret"></b>
                <span className="notification">5</span>
                <p className="hidden-lg hidden-md">Notification</p>
            </div>
        );
        return (
            <div>
                <Nav pullRight className="nav-header-link">
                    <NavItem eventKey={1} href="#">Logged in as {this.props.userData.firstName} </NavItem>
                    <NavItem eventKey={3}> Log out </NavItem>
                </Nav>
            </div>
        );
    }
}

export default HeaderLinks;
