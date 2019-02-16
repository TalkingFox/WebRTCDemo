import { Message, MessageType } from './message';

export class SendMessage extends Message<string> {
    public type: MessageType = MessageType.SendMessage;

    constructor(public message: string) {
        super(message);
    }
}