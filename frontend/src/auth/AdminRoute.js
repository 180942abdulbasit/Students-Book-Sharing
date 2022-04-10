import React, {Component} from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated, isAdmin } from "./index";

const AdminRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => isAuthenticated() && isAdmin() ? (
        <Component {...props} />
    ) : (<Redirect to={{pathname:'/signin', state: { from: props.location}}} />) } />
)

export default AdminRoute