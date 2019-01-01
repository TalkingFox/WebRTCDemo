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
            awsAccessKey: environment.accessKey,
            awsIotHost: environment.awsIot,
            awsRegion: environment.awsRegion,
            awsSecretKey: environment.secretKey,
            clientId: Math.floor(Math.random() * 1000000 + 1).toString(),
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
                            render={() => {
                                return <Client foxClient={this.state.foxClient}></Client>
                            }}
                    />
                    <Route  path="/host" 
                            render={() => {
                                return <Host host={this.state.foxHost}></Host>
                            }
                        }
                    />
                    <Route  path="/client" 
                            component={Client}
                    />
                </div>
    }
}