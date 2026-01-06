import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PolicyDocument = Policy & Document;

@Schema()
export class Policy {
    @Prop({ required: true })
    policyNumber: string;

    @Prop()
    startDate: string;

    @Prop()
    endDate: string;

    @Prop()
    collectionId: string;

    @Prop()
    companyCollectionId: string;

    @Prop()
    userId: string;
}

export const PolicySchema = SchemaFactory.createForClass(Policy);
