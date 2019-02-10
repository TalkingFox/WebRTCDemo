import * as React from 'react';
import * as FoxConnect from 'foxconnect';
import './host.css';

export interface HostProperties {
    host: FoxConnect.Host;
}

export interface HostState {
    room: string;
    messages: string[];
    message?: string;
}

export class Host extends React.Component<HostProperties, HostState> {
    constructor(props: HostProperties) {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
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
            this.props.host.listenForMessages((message: string) => this.print(message));
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

    private sendMessage(): void {
        this.props.host.sendToAll(this.state.message);
        this.print(this.state.message as string);
    }

    render() {
        return <div className="container">
            <div className="banner">
                <span>Room: {this.state.room}</span><br />
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
                    <button onClick={this.sendMessage} disabled={this.state.message == null}>Send Message</button>
                </div>
            </div>
        </div>
            ;
    }
}