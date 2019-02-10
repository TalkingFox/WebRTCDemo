import * as React from 'react';
import * as FoxConnect from 'foxconnect';
import './host.css';

export interface HostProperties {
    host: FoxConnect.Host;
}

export interface HostState {
    room: string;
    messages: string[];
}

export class Host extends React.Component<HostProperties, HostState> {
    constructor(props: HostProperties) {
        super(props);
        this.state = { 
            room: 'loading...',
            messages: []
        };
        this.props.host.createRoom().then((room: string) => {
            this.setState({
                room: room
            });
            this.print('Reserved room:' + room);
            this.props.host.listenForGuests((guest: string) => {
                this.print('The esteemed guest ' + guest + ' has just joined us!');
            });
        });
    }

    public disconnect(): void {
        this.props.host.closeRoom();
        this.print('disconnected');
    }

    private print(message: string): void {
        const newMessages = this.state.messages.slice(0);
        newMessages.push(message);
        this.setState({messages: newMessages});
    }

    render() {
        return <div className="container">
            <div className="banner">
                <span>Room: {this.state.room}</span><br />
            </div>
            <div className="messages">
            {
                this.state.messages.map((message: string) => <p>{message}</p>)
            }
            </div>
            <div className="commands">
                <button onClick={() => this.disconnect()}>Disconnect</button>
            </div>
        </div>
            ;
    }
}