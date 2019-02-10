import * as React from 'react';
import * as FoxConnect from 'foxconnect';

export interface ClientProperties {
    foxClient: FoxConnect.Client;
}

export interface ClientState {
    room: string;
    isConnected: boolean;
    messages: string[];
}

export class Client extends React.Component<ClientProperties, ClientState> {

    constructor(properties: ClientProperties) {
        super(properties);
        this.state = { 
            room: '',
            isConnected: false,
            messages: []
        };
        this.joinRoom = this.joinRoom.bind(this);
    }

    private joinRoom(event: React.FormEvent): void {
        this.props.foxClient.joinRoom(this.state.room)
            .then(() => {
                this.setState({ isConnected: true});
                this.print('connected');
            })
        this.props.foxClient.listenForMessages((message: string) => {
            this.print(message);
        });
        event.preventDefault();
    }

    private print(message: string): void {
        const newMessages = this.state.messages.slice(0);
        newMessages.push(message);
        this.setState({messages: newMessages});
    }

    render() {
        return <div className="container">
            <div className="banner">
                <span hidden={!this.state.isConnected}>Room: {this.state.room}</span>
                <form hidden={this.state.isConnected} onSubmit={this.joinRoom}>
                <label>Join Room:
                        <input type="text"
                        value={this.state.room}
                        onChange={(event) => this.setState({ room: event.currentTarget.value })} />
                </label>
                <input type="submit" value="Join" />
            </form>
            </div>
            <div className="messages">
            {
                this.state.messages.map((message: string) => <p>{message}</p>)
            }
            </div>
        </div>
    }
}