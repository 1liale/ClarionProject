import { BadRequestException } from '@nestjs/common';
import { CallReportsController } from './call-reports.controller';
import { CallReportsService } from './call-reports.service';

// Create a minimal mock for the service
const createMockService = (): jest.Mocked<CallReportsService> => ({
  add: jest.fn(),
  findAll: jest.fn().mockReturnValue([]),
} as unknown as jest.Mocked<CallReportsService>);

describe('CallReportsController', () => {
  let controller: CallReportsController;
  let service: jest.Mocked<CallReportsService>;

  beforeEach(() => {
    service = createMockService();
    controller = new CallReportsController(service);
  });

  it('stores a valid end-of-call report', () => {
    const body: any = {
      message: {
        type: 'end-of-call-report',
        call: { id: 'call-123', startedAt: new Date().toISOString(), endedAt: new Date(Date.now() + 1000).toISOString() },
        transcript: 'User: Hello\nAssistant: Hi',
      },
    };

    const result = controller.addReport(body);
    expect(result).toEqual({ message: 'end-of-call-report stored' });
    expect(service.add).toHaveBeenCalledWith(
      expect.objectContaining({ callId: 'call-123' }),
    );
  });

  it('throws BadRequestException when call identifier is missing', () => {
    const badBody: any = {
      message: {
        type: 'end-of-call-report',
        transcript: 'User: Hi',
      },
    };

    expect(() => controller.addReport(badBody)).toThrow(BadRequestException);
  });
}); 