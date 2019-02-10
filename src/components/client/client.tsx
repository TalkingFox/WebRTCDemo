import * as React from 'react';
import * as FoxConnect from 'foxconnect';

export interface ClientProperties {
    foxClient: FoxConnect.Client;
}

export interface ClientState {
    room: string;
    isConnected: boolean;
    messages: string[];
    message?: string;
}

export class Client extends React.Component<ClientProperties, ClientState> {

    constructor(properties: ClientProperties) {
        super(properties);
        this.state = { 
            room: '',
            isConnected: false,
            messages: []
        };
    }

    private joinRoom(event: React.FormEvent): void {
        this.props.foxClient.joinRoom(this.state.room)
            .then(() => {
                this.setState({ isConnected: true});
                this.print('connected');
            }).catch((reason: any) => {
                this.print('Failed to join room: ' + JSON.stringify(reason));
            });
        this.props.foxClient.listenForMessages((message: string) => {
            this.print('Host said: ' + JSON.parse(message));
        });
        event.preventDefault();
    }

    private print(message: string): void {
        const newMessages = this.state.messages.slice(0);
        newMessages.push(message);
        this.setState({messages: newMessages});
    }

    private disconnect(): void {
        this.print('disconnected');
        this.props.foxClient.leaveRoom();
    }

    private sendMessage(message: string): void {
        this.props.foxClient.send(message);
        this.setState({message: undefined});
    }

    render() {
        return <div className="container">
            <div className="banner">
                <span hidden={!this.state.isConnected}>Room: {this.state.room}</span>
                <form hidden={this.state.isConnected} onSubmit={(event: React.FormEvent) => this.joinRoom(event)}>
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
                this.state.messages.map((message: string, index: number) => <p key={index}>{message}</p>)
            }
            </div>
            <div className="commands">
                <div className="button-array">
                    <button onClick={() => this.disconnect()}>Disconnect</button>
                </div>
                <div className="sendMessage">
                    <textarea 
                        value={this.state.message}
                        onChange={(event) => this.setState({message: event.currentTarget.value})}
                    ></textarea>
                    <button onClick={() => this.sendMessage(this.state.message as string)} 
                            disabled={this.state.message == null}>Send Message</button>
                </div>
            </div>
        </div>
    }
}