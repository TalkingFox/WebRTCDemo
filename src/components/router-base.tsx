import { Route } from "react-router";
import React = require("react");
import { Home } from "./home";
import { Host } from "./host";
import { Client } from "./client";
import { FoxConnect } from "foxconnect";
import { environment } from "../environment";

export interface ServiceState {
    foxConnect: FoxConnect;
}

export class RouterBase extends React.Component<{},ServiceState> {
    private foxConnect = new FoxConnect({
        awsAccessKey: environment.accessKey,
        awsIotHost: environment.awsIot,
        awsRegion: environment.awsRegion,
        awsSecretKey: environment.secretKey,
        clientId: Math.floor(Math.random() * 1000000 + 1).toString(),
        signalServer: environment.signalServer
    });

    render() {
        return  <div>
                    <Route  path="/" 
                            exact={true}
                            component={Home}
                    />
                    <Route  path="/host" 
                            render={() => {
                                return <Host foxConnect={this.foxConnect}></Host>
                            }
                        }
                    />
                    <Route  path="/client" 
                            component={Client}
                    />
                </div>
    }
}