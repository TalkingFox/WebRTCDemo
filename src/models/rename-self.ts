import { Message, MessageType } from './message';

export class RenameSelf extends Message<string> {
    public type: MessageType = MessageType.RenameSelf;
    
    constructor(public name: string) {
        super(name);
    }
}