import React, { Component } from "react";

import  { FirebaseContext } from '../firebase';
import { withFirebase } from '../firebase/context';

class RelativeDashboard extends Component {
    render () {
        return (
            <div>
                This is the RelativeDashboard page.
            </div>
        );
    }
};

export default withFirebase(RelativeDashboard);