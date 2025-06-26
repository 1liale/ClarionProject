import { BadRequestException } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

// Mock service implementation focusing only on used methods
const createMockService = (): jest.Mocked<AppointmentsService> => ({
  add: jest.fn(),
  findAll: jest.fn().mockReturnValue([]),
} as unknown as jest.Mocked<AppointmentsService>);

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: jest.Mocked<AppointmentsService>;

  beforeEach(() => {
    service = createMockService();
    controller = new AppointmentsController(service);
  });

  it('stores a valid appointment', () => {
    const body = {
      id: 'appt-1',
      callId: 'call-1',
      date: '2025-01-01',
      time: '10:00',
      patientName: 'Alice',
    } as any; // simplify typing for the test

    expect(controller.create(body)).toEqual({ message: 'appointment stored' });
    expect(service.add).toHaveBeenCalledWith(body);
  });

  it('throws BadRequestException when required fields are missing', () => {
    expect(() => controller.create({} as any)).toThrow(BadRequestException);
  });
}); 