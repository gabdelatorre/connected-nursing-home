import React from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter,
    Route,
    Switch
} from 'react-router-dom';

import App from './containers/App.jsx';

import './assets/sass/styles.css';

ReactDOM.render((
    <BrowserRouter>
        <Switch>
            <Route path="/" name="Home" component={App}/>
        </Switch>
    </BrowserRouter>
),document.getElementById('root'));
