import * as React from 'react';
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
        this.state = { room: 'loading...' };
        this.props.host.createRoom().then((room: string) => {
            this.setState({
                room: room
            });
            console.log(room);
            this.props.host.listenForGuests((guest: string) => {
                console.log('The esteemed guest ' + guest + ' has just joined us!');
            });
        });
    }

    public disconnect(): void {
        this.props.host.closeRoom();
        console.log('disconnected');
    }

    render() {
        return <div>
                    <span>Room is {this.state.room}</span><br/>
                    <button onClick={() => this.disconnect()}>Disconnect</button>
                </div>
        ;
    }
}