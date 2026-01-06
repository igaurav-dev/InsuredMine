import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    scheduledTime: Date;

    @Prop({ default: false })
    processed: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
