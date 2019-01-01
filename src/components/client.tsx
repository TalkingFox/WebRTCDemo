import React = require("react");
import * as FoxConnect from 'foxconnect';

export interface ClientProperties {
    foxClient: FoxConnect.Client;
}

export interface ClientState {
    roomName: string;
}

export class Client extends React.Component<ClientProperties, ClientState> {
    
    constructor(properties: ClientProperties) {
        super(properties);
        this.state = { roomName: ''};
        this.joinRoom = this.joinRoom.bind(this);
    }

    private joinRoom(): void {
        this.props.foxClient.joinRoom(this.state.roomName);
        this.props.foxClient.listenForMessages((message: string) => {
            console.log(message);
        });
    }

    render() {
        return  <form onSubmit={this.joinRoom}>
                    <label>Room:
                        <input  type="text" 
                                value={this.state.roomName} 
                                onChange={(event) => this.setState({roomName: event.currentTarget.value})}/>
                    </label>
                    <input type="submit" value="Join"/>
                </form>
    }
}