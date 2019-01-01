import React = require("react");
import * as FoxConnect from 'foxconnect';

export interface HostProperties {
    host: FoxConnect.Host;
}

export interface HostState {
    room: string;
}

export class Host extends React.Component<HostProperties, HostState> {
    constructor(props: HostProperties) {
        super(props);
        this.state = { room: null };
        console.log('props', this.props);
        this.props.host.createRoom().then((room: string) => {
            this.setState({
                room: room
            });
        });
    }

    render() {
        return <span>Room is {this.state.room || 'loading...'}</span>;
    }
}