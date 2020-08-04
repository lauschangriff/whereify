import React from 'react';
import ReactDOM from 'react-dom';
import Merger from './Merger';
import {Router, Switch, Route, NoMatch} from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';
import history from "./history";
import NotFound from "./NotFound";

ReactDOM.render(
    <Router history={history}>
        <Switch>
            <Route path="/" exact component={Merger}/>
            <Route path="/merger" exact component={Merger}/>
            <Route path="/view" exact component={Merger}/>
            <Route path="*"><NotFound /></Route>
        </Switch>
    </Router>,
    document.getElementById('root')
);