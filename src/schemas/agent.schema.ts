import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AgentDocument = Agent & Document;

@Schema()
export class Agent {
    @Prop({ required: true })
    name: string;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
