import { Body, Controller, Get, Post, BadRequestException } from '@nestjs/common';
import { AppointmentsService, Appointment } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /** Endpoint hit directly from Vapi tool call. */
  @Post()
  create(@Body() body: Omit<Appointment, 'createdAt'>) {
    if (typeof body !== 'object' || body === null) {
      throw new BadRequestException('Invalid payload');
    }

    // Basic shape validation – required props.
    const required = ['id', 'callId', 'date', 'time', 'patientName'] as const;
    const missing = required.filter((k) => !(k in body));
    if (missing.length) {
      throw new BadRequestException(`Missing required fields: ${missing.join(', ')}`);
    }

    this.appointmentsService.add(body);
    return { message: 'appointment stored' };
  }

  /** Dashboard fetches all appointments. */
  @Get()
  all() {
    return this.appointmentsService.findAll();
  }
} 