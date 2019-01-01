import React = require("react");
import { FoxConnect } from "foxconnect";

export interface ClientProperties {
    foxConnect: FoxConnect;
}

export class Client extends React.Component<ClientProperties,{}> {
    render() {
        return <span>client</span>;
    }
}