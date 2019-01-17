import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';

import HeaderLinks from './HeaderLinks.jsx';
import appRoutes from '../routes/appRoutes';

import { withRouter } from 'react-router-dom';

class Header extends Component{
    constructor(props){
        super(props);
        this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
        this.state = {
            sidebarExists: false
        };
    }

    mobileSidebarToggle(e){
        console.log("Mobile Sidebar Toggle!");
        if(this.state.sidebarExists === false){
            this.setState({
                sidebarExists : true
            });

        }
        e.preventDefault();
        document.documentElement.classList.toggle('nav-open');
    }

    getBrand(){
        var name;
        appRoutes.map((prop,key) => {
            if(prop.collapse){
                 prop.views.map((prop,key) => {
                    if(prop.path === this.props.location.pathname){
                        name = prop.title;
                    }
                    return null;
                })
            } else {
                if(prop.redirect) {
                    if(prop.path === this.props.location.pathname){
                        name = prop.title;
                    }
                }
                else {
                    if(prop.path === this.props.location.pathname){
                        name = prop.title;
                    }
                }
            }
            return null;
        })
        return name;
    }
    render(){
        return (
            <div>
            <Navbar fluid>
                <Navbar.Header>
                    <Navbar.Brand>
                        {this.getBrand()}
                    </Navbar.Brand>
                    <Navbar.Toggle onClick={this.mobileSidebarToggle} />
                </Navbar.Header>
                <Navbar.Collapse>
                    <HeaderLinks userData={this.props.userData} />
                </Navbar.Collapse>
            </Navbar>
            </div>
        );
    }
}

export default withRouter(Header);
