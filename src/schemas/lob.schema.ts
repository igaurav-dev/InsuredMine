import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LOBDocument = LOB & Document;

@Schema()
export class LOB {
    @Prop({ required: true })
    categoryName: string;
}

export const LOBSchema = SchemaFactory.createForClass(LOB);
