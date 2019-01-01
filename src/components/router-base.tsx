import { Route } from "react-router";
import React = require("react");
import { Home } from "./home";
import { Host } from "./host";
import { Client } from "./client";

export class RouterBase extends React.Component {
    render() {
        return  <div>
                    <Route path="/" exact={true} component={Home}/>
                    <Route path="/host" component={Host}/>
                    <Route path="/client" component={Client}/>
                </div>
    }
}