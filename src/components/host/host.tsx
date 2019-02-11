import * as React from 'react';
import * as FoxConnect from 'foxconnect';
import './host.css';
import { environment } from 'src/environment';

export interface HostProperties { }

export interface HostState {
    room: string;
    messages: string[];
    message: string;
}

export class Host extends React.Component<HostProperties, HostState> {
    private host: FoxConnect.Host;

    constructor(props: HostProperties) {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
        this.state = { 
            room: 'loading...',
            messages: [],
            message: ''
        };
        this.host = new FoxConnect.Host({
            signalServer: environment.signalServer,
            onClientDisconnected: (clientId: string) => this.guestDisconnected(clientId),
            onGuestJoined: (clientId: string) => this.guestJoined(clientId),
            onMessageReceived: (clientId: string, message: string) => this.messageReceived(clientId, message)
        });

        this.host.createRoom().then((room: string) => {
            this.setState({
                room: room
            });
            this.print('Reserved room:' + room);
        });
    }

    public disconnect(): void {
        this.host.closeRoom();
        this.print('Stopped accepting guests.');
    }

    private guestDisconnected(clientId: string): void {
        this.print("client '" + clientId + "' disconnected");
    }

    private guestJoined(clientId: string): void {
        this.print('The esteemed guest ' + clientId + ' has just joined us!');
    }

    private messageReceived(clientId: string, message: string): void {
        this.print(message);
    }

    private print(message: string): void {
        const newMessages = this.state.messages.slice(0);
        newMessages.push(message);
        this.setState({messages: newMessages});
    }

    private sendMessage(): void {
        this.host.sendToAll(this.state.message);
        this.print(this.state.message as string);
        this.setState({message: ''});
    }

    render() {
        return <div className="container">
            <div className="banner">
                <span>Room: {this.state.room}</span><br />
            </div>
            <div className="messages">
            {
                this.state.messages.map((message: string, index: number) => <p key={index}>{index}:{message}</p>)
            }
            </div>
            <div className="commands">
                <div className="button-array">
                    <button onClick={() => this.disconnect()}>Close Room</button>
                </div>
                <div className="sendMessage">
                    <textarea 
                        value={this.state.message}
                        onChange={(event) => this.setState({message: event.currentTarget.value})}
                    ></textarea>
                    <button onClick={this.sendMessage} disabled={this.state.message.length === 0}>Send Message</button>
                </div>
            </div>
        </div>
            ;
    }
}