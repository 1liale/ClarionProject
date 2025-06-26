import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CallReportsController } from './call-reports.controller';
import { CallReportsService } from './call-reports.service';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

@Module({
  imports: [],
  controllers: [AppController, CallReportsController, AppointmentsController],
  providers: [AppService, CallReportsService, AppointmentsService],
})
export class AppModule {}
