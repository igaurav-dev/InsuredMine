import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { Message, MessageSchema } from '../../schemas/message.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ],
    controllers: [SchedulerController],
    providers: [SchedulerService],
})
export class SchedulerModule { }
