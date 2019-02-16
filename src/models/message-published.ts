import { Message, MessageType } from './message';

export class MessagePublished extends Message<UserMessage> {
    public type: MessageType = MessageType.MessagePublished;

    constructor(userMessage: UserMessage) {
        super(userMessage);
    }
}

export interface UserMessage {
    message: string;
    user: string;
}