import React, { Component } from "react";

import  { FirebaseContext } from '../firebase';
import { withFirebase } from '../firebase/context';

class NursingHomeDashboard extends Component {
    render () {
        return (
            <div>
                This is the NursingHomeDashboard page.
            </div>
        );
    }
};

export default withFirebase(NursingHomeDashboard);