export abstract class Message<T> {
    public abstract type: MessageType;

    constructor(public body: T) { }
}

export enum MessageType {
    SendMessage = 'send-message',
    RenameSelf = 'rename-self',
    MessagePublished = 'message-published'
}