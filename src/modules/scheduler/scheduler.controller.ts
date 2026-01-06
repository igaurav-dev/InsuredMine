import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';

@Controller('schedule')
export class SchedulerController {
    constructor(private readonly schedulerService: SchedulerService) { }

    @Post('message')
    async scheduleMessage(@Body() body: { message: string; day: string; time: string }) {
        // Expected format: day (YYYY-MM-DD), time (HH:MM) or similar.
        // Let's assume standard ISO strings or specific fields.
        const { message, day, time } = body;

        if (!message || !day || !time) {
            throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
        }

        // Combine day and time
        // Assuming day is 'YYYY-MM-DD' and time is 'HH:mm'
        const dateTimeString = `${day}T${time}:00`;
        const scheduleDate = new Date(dateTimeString);

        if (isNaN(scheduleDate.getTime())) {
            throw new HttpException('Invalid date/time format', HttpStatus.BAD_REQUEST);
        }

        if (scheduleDate < new Date()) {
            throw new HttpException('Scheduled time must be in the future', HttpStatus.BAD_REQUEST);
        }

        return this.schedulerService.scheduleMessage(message, scheduleDate);
    }
}
