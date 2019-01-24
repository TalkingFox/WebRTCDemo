import { Route } from "react-router";
import React = require("react");
import { Home } from "./home";
import { Host } from "./host";
import { Client } from "./client";
import * as FoxConnect from 'foxconnect';
import { environment } from "../environment";
import { FoxConnectOptions } from "foxconnect/dist/models/foxConnectOptions";

export interface ServiceState {
    foxHost: FoxConnect.Host;
    foxClient: FoxConnect.Client;
}

export class RouterBase extends React.Component<{},ServiceState> {
    constructor(props: {}) {
        super(props);
        const options: FoxConnectOptions = {
            signalServer: environment.signalServer
        };
        const client = new FoxConnect.Client(options);
        const host = new FoxConnect.Host(options);
        this.state = {
            foxClient: client,
            foxHost: host
        };
    }
    

    render() {
        return  <div>
                    <Route  path="/" 
                            exact={true}
                            component={Home}
                    />
                    <Route  path="/host" 
                            render={() => {
                                return <Host host={this.state.foxHost}></Host>
                            }
                        }
                    />
                    <Route  path="/client" 
                            render={() => {
                                return <Client foxClient={this.state.foxClient}></Client>
                            }}
                    />
                </div>
    }
}