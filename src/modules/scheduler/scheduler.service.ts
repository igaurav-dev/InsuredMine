import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as schedule from 'node-schedule';
import { Message, MessageDocument } from '../../schemas/message.schema';

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    ) { }

    async scheduleMessage(content: string, dateTime: Date) {
        // Save to DB immediately with processed=false? Or just schedule?
        // Requirement: "inserts that message into DB at that particular day and time."
        // So we schedule a job, and the job inserts into DB.

        this.logger.log(`Scheduling message: "${content}" for ${dateTime}`);

        schedule.scheduleJob(dateTime, async () => {
            this.logger.log(`Executing scheduled job: Inserting message "${content}"`);
            await this.messageModel.create({
                content,
                scheduledTime: dateTime,
                processed: true // It's inserted at the time of execution
            });
        });

        return { status: 'Scheduled', time: dateTime };
    }
}
