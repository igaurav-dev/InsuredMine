import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true })
    firstName: string;

    @Prop()
    dob: string;

    @Prop()
    address: string;

    @Prop()
    phone: string;

    @Prop()
    state: string;

    @Prop()
    zip: string;

    @Prop()
    email: string;

    @Prop()
    gender: string;

    @Prop()
    userType: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
