import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

import appRoutes from '../routes/appRoutes';
import HeaderLinks from './HeaderLinks';
import _ from 'lodash';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            navLinks: [],
        }
    }

    activeRoute(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? 'active' : '';
    }

    updateDimensions() {
        this.setState({ width: window.innerWidth });
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));

        if (this.props.userData.role == "EMPLOYEE"){
            this.setState ({
                navLinks: [
                    "edashboard",
                    "nhdashboard"
                ]
            })
        }
        else if (this.props.userData.role == "RELATIVE"){
            this.setState ({
                navLinks: [
                    "rdashboard",
                ]
            })
        }
        
    }

    render() {

        return (
            <div id="sidebar" className="sidebar">
                <div className="logo">
                    {/* <img src={loginimg} className="login-img" /> */}
                </div>

                <div className="sidebar-wrapper">
                    <ul className="nav">
                        {this.state.width <= 991 ? (<HeaderLinks userData={this.props.userData} />) : null
                        }
                        {
                            /* Dynamic Sidebar */
                            appRoutes.map((prop) => {   
                                
                                if (_.includes(this.state.navLinks, prop.name)) {
                                return (
                                    <li className={this.activeRoute(prop.path)} key={prop.name}>
                                        <NavLink to={prop.path} className="nav-link" activeClassName="active">
                                            <p>{prop.title}</p>
                                        </NavLink>
                                    </li>
                                );
                                }
                                else {
                                    return null
                                }
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default withRouter(Sidebar);
