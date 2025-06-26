import {
  Body,
  Controller,
  Get,
  Post,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CallReportsService, EndOfCallReport } from './call-reports.service';

// ---------------------------------------------
// Type helpers to support both the new envelope
// (`{ message: { ... } }`) and older flat shape.
// ---------------------------------------------

export type FlatReport = EndOfCallReport & {
  // legacy id locations
  callId?: string;
  call_id?: string;
  id?: string;
  type?: string;
  event?: string;
};

export type EnvelopeReport = { message: EndOfCallReport };

export type WebhookBody = EnvelopeReport | FlatReport;

@Controller('call-reports')
export class CallReportsController {
  private readonly logger = new Logger(CallReportsController.name);

  constructor(private readonly callReportsService: CallReportsService) {}

  /**
   * Store a new Vapi end-of-call report.
   */
  @Post()
  addReport(@Body() body: WebhookBody) {
    try {
      if (typeof body !== 'object' || body === null) {
        throw new BadRequestException('Invalid payload');
      }

      const isEnvelope = 'message' in body;
      const report = (isEnvelope ? (body as EnvelopeReport).message : body) as EndOfCallReport;

      const eventType = report.type;

      const rawCallId = ((): string | undefined => {
        if (report.call?.id) return report.call.id;
        // legacy fallbacks on flat payload (deprecated)
        const flat = body as FlatReport;
        return flat.callId ?? flat.call_id ?? flat.id;
      })();

      const payload: EndOfCallReport = report;

      // --- derive convenience fields for the dashboard -------------------
      // Duration in seconds, if not provided by Vapi directly.
      const durationSeconds = (() => {
        if (typeof (payload as any).duration === 'number') return (payload as any).duration;
        const start = payload.startedAt ?? payload.call?.startedAt;
        const end = payload.endedAt ?? payload.call?.endedAt;
        if (start && end) {
          return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 1000);
        }
        return 0;
      })();

      // Extract the first user question & assistant response for quick view.
      type SimpleMsg = { role?: string; message?: string };
      const msgsSource = (payload as unknown as { messages?: SimpleMsg[] }).messages ?? (payload.call?.messages as unknown as SimpleMsg[]) ?? [];
      const firstUser = msgsSource.find((m) => m.role === 'user')?.message ?? 'N/A';
      const firstAssistant = msgsSource.find((m) => m.role === 'assistant')?.message ?? 'N/A';

      const enrichedPayload: EndOfCallReport = {
        ...payload,
        duration: durationSeconds,
        userQuestion: firstUser,
        assistantResponse: firstAssistant,
      } as EndOfCallReport;

      if (
        (typeof rawCallId !== 'string' && typeof rawCallId !== 'number') ||
        `${rawCallId}`.trim() === ''
      ) {
        throw new BadRequestException('Missing or invalid call identifier');
      }

      const callIdStr = String(rawCallId);

      // Persist only end-of-call reports
      if (eventType === 'end-of-call-report') {
        this.callReportsService.add({
          callId: callIdStr,
          payload: enrichedPayload,
        });
        return { message: `${eventType} stored` };
      }

      // Handle other webhook types for future use (currently just ignored).
      this.logger.debug(
        `Ignored non-endCall webhook: ${eventType ?? 'unknown'} for ${callIdStr}`,
      );
      return { message: `Ignored ${eventType ?? 'unknown'} webhook` };
    } catch (err) {
      // Surface known validation issues, rethrow others.
      if (err instanceof BadRequestException) throw err;
      this.logger.error('Error processing webhook', err as Error);
      throw new BadRequestException('Failed to process webhook');
    }
  }

  /**
   * Retrieve every stored report.
   */
  @Get()
  getReports() {
    return this.callReportsService.findAll();
  }
}
