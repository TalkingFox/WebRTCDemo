import { Route } from "react-router";
import * as React from 'react';
import { Home } from "./components/home/home";
import { Host } from "./components/host/host";
import { Client } from "./components/client/client";
import './app.css';

export interface ServiceState { }

export class App extends React.Component<{},ServiceState> {
    constructor(props: {}) {
        super(props);
        this.state = { };
    }
    

    render() {
        return  <div className="routeContainer">
                    <Route  path="/" 
                            exact={true}
                            component={Home}
                    />
                    <Route  path="/host" 
                            render={() => {
                                return <Host></Host>
                            }
                        }
                    />
                    <Route  path="/client" 
                            render={() => {
                                return <Client></Client>
                            }}
                    />
                </div>
    }
}