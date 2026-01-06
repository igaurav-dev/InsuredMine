import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as osUtils from 'os-utils';

@Injectable()
export class MonitorService {
    private readonly logger = new Logger(MonitorService.name);

    // Check every 5 seconds (Real-time tracking)
    @Cron('*/5 * * * * *')
    handleCron() {
        osUtils.cpuUsage((percentage) => {
            const usage = percentage * 100;
            // this.logger.log(`CPU Usage: ${usage.toFixed(2)}%`);
            if (usage > 70) {
                this.logger.error(`high cpu usage detected: ${usage.toFixed(2)}%. restarting server...`);
                process.exit(1);
            }
        });
    }
}
