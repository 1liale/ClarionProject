import {
  Body,
  Controller,
  Get,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { CallReportsService } from './call-reports.service';

@Controller('call-reports')
export class CallReportsController {
  constructor(private readonly callReportsService: CallReportsService) {}

  /**
   * Store a new Vapi end-of-call report.
   */
  @Post()
  addReport(@Body() body: Record<string, unknown>) {
    if (!body || typeof body !== 'object') {
      throw new BadRequestException('Invalid report payload');
    }

    const { callId = undefined, ...rest } = body as {
      callId?: unknown;
      [key: string]: unknown;
    };
    if (typeof callId !== 'string' || !callId.trim()) {
      throw new BadRequestException('Missing or invalid "callId" property');
    }

    this.callReportsService.add({
      callId,
      payload: rest as Record<string, unknown>,
    });
    return { message: 'Report stored successfully' };
  }

  /**
   * Retrieve every stored report.
   */
  @Get()
  getReports() {
    return this.callReportsService.findAll();
  }
}
