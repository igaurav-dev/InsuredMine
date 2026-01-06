import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

//... imports
import { UploadModule } from './modules/upload/upload.module';
import { PolicyModule } from './modules/policy/policy.module';
import { MonitorModule } from './modules/monitor/monitor.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';

@Module({
  imports: [
    UploadModule,
    PolicyModule,
    MonitorModule,
    SchedulerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
