import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CallReportsController } from './call-reports.controller';
import { CallReportsService } from './call-reports.service';

@Module({
  imports: [],
  controllers: [AppController, CallReportsController],
  providers: [AppService, CallReportsService],
})
export class AppModule {}
