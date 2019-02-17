import * as React from 'react';
import * as FoxConnect from 'foxconnect';
import './host.css';
import { environment } from 'src/environment';
import { Message, MessageType } from 'src/models/message';
import { SendMessage } from 'src/models/send-message';
import { MessagePublished } from 'src/models/message-published';
import { RoomCreatedResponse } from 'foxconnect/dist/models/roomCreatedResponse';
import { RenameSelf } from 'src/models/rename-self';

export interface HostProperties { }

export interface HostState {
    room: string;
    messages: string[];
    message: string;
    guests: Map<string,string>,
    hostId?: string
}

export class Host extends React.Component<HostProperties, HostState> {
    private host: FoxConnect.Host;
    private latestMessage: HTMLDivElement;

    constructor(props: HostProperties) {
        super(props);
        this.state = { 
            room: 'loading...',
            messages: [],
            message: '',
            guests: new Map<string,string>()
        };
        this.host = new FoxConnect.Host({
            signalServer: environment.signalServer,
            onClientDisconnected: (clientId: string) => this.guestDisconnected(clientId),
            onGuestJoined: (clientId: string) => this.guestJoined(clientId),
            onMessageReceived: (clientId: string, message: string) => this.messageReceived(clientId, message)
        });

        this.host.createRoom().then((response: RoomCreatedResponse) => {
            this.setState({
                room: response.room,
                hostId: response.host_id
            });
            this.print('Reserved room:' + response.room + 'Your id is '+response.host_id);
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
        const guests = new Map<string,string>(this.state.guests);
        guests.set(clientId, clientId);
        this.setState({
            guests: guests
        });
    }

    private onMessageInput(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
        if (event.key === 'Enter') {
            this.sendMessage();
            event.preventDefault();
        }
    }

    private messageReceived(clientId: string, message: string): void {
        const data = JSON.parse(message) as Message<any>;
        switch (data.type) {
            case MessageType.SendMessage:
                this.publishMessage(clientId, (data as SendMessage).body);
                break;
            case MessageType.RenameSelf:
                const guests = new Map<string,string>(this.state.guests);
                const newName = (data as RenameSelf).body;
                guests.set(clientId, newName);
                this.setState({
                    guests: guests
                });
                this.publishMessage(newName, clientId + 'is now '+newName);
                break;
            default:
                this.print(clientId + ': Sent unrecognized event: ' + message);
        }
    }

    private publishMessage(clientId: string, message: string): void {
        const user = this.state.guests.get(clientId) || clientId;
        const publish = new MessagePublished({
            message: message,
            user: user
        });
        this.host.sendToAll(publish);
        this.print(user + ': ' + message);
    }

    private print(message: string): void {
        const newMessages = this.state.messages.slice(0);
        newMessages.push(message);
        this.setState({messages: newMessages});
        this.latestMessage.scrollIntoView({behavior: 'smooth'});
    }

    private sendMessage(): void {
        if (this.state.message.length === 0) {
            return;
        }
        this.setState({
            message: ''
        });
        this.publishMessage(this.state.hostId || 'host', this.state.message);
    }

    private renameSelf(): void {
        const newName = window.prompt('Enter a new name:', this.state.hostId);
        if (!newName) {
            return;
        }
        this.setState({
            hostId: newName
        });
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
            <div ref={(element) => { this.latestMessage = element as HTMLDivElement}}>
            </div>
            </div>
            <div className="commands">
                <div className="button-array">
                    <button onClick={() => this.disconnect()}>Close Room</button>
                    <button onClick={() => this.renameSelf()}>Rename</button>
                </div>
                <div className="sendMessage">
                    <textarea 
                        value={this.state.message}
                        onChange={(event) => this.setState({message: event.currentTarget.value})}
                        onKeyPress={(event) => this.onMessageInput(event)}
                    ></textarea>
                    <button onClick={() => this.sendMessage()} disabled={this.state.message.length === 0}>Send Message</button>
                </div>
            </div>
        </div>
            ;
    }
}