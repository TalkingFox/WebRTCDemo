import * as React from 'react';
import * as FoxConnect from 'foxconnect';
import { environment } from 'src/environment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface ClientProperties { }

export interface ClientState {
    room: string;
    isConnected: boolean;
    messages: string[];
    message: string;
    isJoiningRoom: boolean;
}

export class Client extends React.Component<ClientProperties, ClientState> {

    private foxClient: FoxConnect.Client;

    constructor(properties: ClientProperties) {
        super(properties);
        this.state = { 
            room: '',
            isConnected: false,
            messages: [],
            message: '',
            isJoiningRoom: false
        };
        this.foxClient = new FoxConnect.Client({
            onDisconnect: () => this.disconnect(),
            onMessageReceived: (message: string) => {
                this.print('Host said: ' + JSON.parse(message));
            },
            signalServer: environment.signalServer
        });
    }

    private joinRoom(event: React.FormEvent): void {
        this.setState({isJoiningRoom: true});
        this.foxClient.joinRoom(this.state.room)
            .then(() => {
                this.setState({ isConnected: true});
                this.print('connected');
            }).catch((reason: any) => {
                this.print('Failed to join room: ' + JSON.stringify(reason));
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
        this.foxClient.leaveRoom();
    }

    private sendMessage(message: string): void {
        this.foxClient.send(message);
        this.print('You said: ' + message);
        this.setState({message: ''});
    }

    render() {
        return <div className="container">
            <div className="banner">
                <span hidden={!this.state.isConnected}>Room: {this.state.room}</span>
                <form hidden={this.state.isConnected} onSubmit={(event: React.FormEvent) => this.joinRoom(event)}>
                <label>Join Room 
                        <input type="text"
                        value={this.state.room}
                        onChange={(event) => this.setState({ room: event.currentTarget.value })} />
                </label>
                <button type="submit" disabled={this.state.isJoiningRoom}>
                {
                    this.state.isJoiningRoom ? <FontAwesomeIcon icon='circle-notch' spin/> : 'Join Room'
                }
                </button>
            </form>
            </div>
            <div className="messages">
            {
                this.state.messages.map((message: string, index: number) => <p key={index}>{index}:{message}</p>)
            }
            </div>
            <div className="commands">
                <div className="button-array">
                    <button onClick={() => this.disconnect()}>Disconnect</button>
                    <button>Rename</button>
                </div>
                <div className="sendMessage">
                    <textarea 
                        value={this.state.message}
                        onChange={(event) => this.setState({message: event.currentTarget.value})}
                    ></textarea>
                    <button onClick={() => this.sendMessage(this.state.message as string)} 
                            disabled={this.state.message.length === 0}>Send Message</button>
                </div>
            </div>
        </div>
    }
}