import { Injectable } from '@nestjs/common';
import { Vapi } from '@vapi-ai/server-sdk';

export interface EndOfCallReport
  extends Vapi.ServerMessageEndOfCallReport {
  /** Computed duration in seconds */
  duration: number;
  /** Last user utterance in the call */
  userQuestion: string;
  /** Last assistant response in the call */
  assistantResponse: string;
}

export interface CallReport {
  /** Unique identifier for the call (taken from `call.id`). */
  callId: string;
  /** The full end-of-call report coming from Vapi. */
  payload: EndOfCallReport;
  /** Timestamp when the report was received by this backend. */
  receivedAt: Date;
}

@Injectable()
export class CallReportsService {
  /** In-memory store for demo purposes. Replace with DB in production. */
  private readonly reports: CallReport[] = [];

  /**
   * Persist a new call report in memory.
   */
  add(report: Omit<CallReport, 'receivedAt'>): void {
    this.reports.push({ ...report, receivedAt: new Date() });
  }

  /**
   * Retrieve all stored call reports.
   */
  findAll(): CallReport[] {
    // Return a shallow copy to avoid accidental external mutation.
    return [...this.reports];
  }
}
