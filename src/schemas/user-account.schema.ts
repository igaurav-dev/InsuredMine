import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserAccountDocument = UserAccount & Document;

@Schema()
export class UserAccount {
    @Prop({ required: true })
    accountName: string;
}

export const UserAccountSchema = SchemaFactory.createForClass(UserAccount);
