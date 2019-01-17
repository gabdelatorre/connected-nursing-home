import React, { Component } from "react";

import  { FirebaseContext } from '../firebase';
import { withFirebase } from '../firebase/context';

class EmployeeDashboard extends Component {
    render () {
        return (
            <div>
                This is the EmployeeDashboard page.
            </div>
        );
    }
};

export default withFirebase(EmployeeDashboard);