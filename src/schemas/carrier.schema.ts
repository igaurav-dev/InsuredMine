import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CarrierDocument = Carrier & Document;

@Schema()
export class Carrier {
    @Prop({ required: true })
    companyName: string;
}

export const CarrierSchema = SchemaFactory.createForClass(Carrier);
