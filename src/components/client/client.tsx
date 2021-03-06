import * as React from 'react';
import * as FoxConnect from 'foxconnect';
import { environment } from 'src/environment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SendMessage } from 'src/models/send-message';
import { Message, MessageType } from 'src/models/message';
import { MessagePublished } from 'src/models/message-published';
import { RenameSelf } from 'src/models/rename-self';

export interface ClientProperties { }

export interface ClientState {
    room: string;
    isConnected: boolean;
    messages: string[];
    message: string;
    isJoiningRoom: boolean;
    isSending1000: boolean;
}

export class Client extends React.Component<ClientProperties, ClientState> {

    private foxClient: FoxConnect.Client;
    private latestMessage: HTMLDivElement;

    constructor(properties: ClientProperties) {
        super(properties);
        this.state = {
            room: '',
            isConnected: false,
            messages: [],
            message: '',
            isJoiningRoom: false,
            isSending1000: false
        };
        this.foxClient = new FoxConnect.Client({
            onDisconnect: () => this.disconnect(),
            onMessageReceived: (message: string) => {
                this.parseMessage(message);
            },
            onMessageFailed: (error) => {
                alert(error);
            },
            signalServer: environment.signalServer
        });
    }

    private joinRoom(event: React.FormEvent): void {
        this.setState({ isJoiningRoom: true });
        this.foxClient.joinRoom(this.state.room)
            .then(() => {
                this.setState({ isConnected: true });
                this.print('connected');
            }).catch((reason: any) => {
                this.print('Failed to join room: ' + JSON.stringify(reason));
                this.setState({isJoiningRoom: false});
            });
        event.preventDefault();
    }

    private onMessageInput(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
        if (event.key === 'Enter') {
            this.sendMessage(this.state.message);
            event.preventDefault();
        }
    }

    private parseMessage(message: string): void {
        const data = JSON.parse(message) as Message<any>;
        switch (data.type) {
            case MessageType.MessagePublished:
                const newData = data as MessagePublished;
                this.print(newData.body.user + ': ' + newData.body.message);
                break;
            default:
                this.print('Host sent unrecognized event: ' + message);
        }
    }

    private print(message: string): void {
        const newMessages = this.state.messages.slice(0);
        newMessages.push(message);
        this.setState({ messages: newMessages });
        this.latestMessage.scrollIntoView({behavior: 'smooth'});
    }

    private disconnect(): void {
        this.print('disconnected');
        this.foxClient.leaveRoom();
    }

    private renameSelf(): void {
        const newName = window.prompt('Enter a new name:');
        if (!newName) {
            return;
        }
        const nameChange = new RenameSelf(newName);
        this.foxClient.send(nameChange);
        this.print('You changed your name to ' + newName);
    }

    private sendMessage(message: string): void {
        if (message.length === 0) {
            return;
        }
        const data = new SendMessage(message);
        this.foxClient.send(data);
        this.setState({
            message: ''
        });
    }

    private send1000(): void {
        if (this.state.isSending1000) {
            return;
        }
        this.setState({
            isSending1000: true
        });
        let count = 0;
        const id = setInterval(() => {
            this.sendMessage('Load test message: ' + (count + 1));
            if (++count === 1000) {
                this.setState({isSending1000: false});
                clearInterval(id);
            }
        }, 100);
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
                            this.state.isJoiningRoom ? <FontAwesomeIcon icon='circle-notch' spin /> : 'Join Room'
                        }
                    </button>
                </form>
            </div>
            <div className="messages">
                {
                    this.state.messages.map((message: string, index: number) => <p key={index}>{index}:{message}</p>)
                }
                <div ref={(element) => { this.latestMessage = element as HTMLDivElement}}>
                </div>
            </div>
            <div className="commands">
                <div className="button-array">
                    <button onClick={() => this.disconnect()}>Disconnect</button>
                    <button onClick={() => this.renameSelf()}>Rename</button>
                    <button onClick={() => this.send1000()}>Send 1000 Messages</button>
                </div>
                <div className="sendMessage">
                    <textarea
                        value={this.state.message}
                        onChange={(event) => this.setState({ message: event.currentTarget.value })}
                        onKeyPress={(event) => this.onMessageInput(event)}
                    ></textarea>
                    <button onClick={() => this.sendMessage(this.state.message as string)}
                        disabled={this.state.message.length === 0}>Send Message</button>
                </div>
            </div>
        </div>
    }
}