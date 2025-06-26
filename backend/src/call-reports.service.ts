import { Injectable } from '@nestjs/common';

export interface CallReport {
  /** Unique identifier for the call (coming from Vapi). */
  callId: string;
  /** Raw payload / metadata coming from Vapi. */
  payload: Record<string, unknown>;
  /** Timestamp when the report was received by the backend. */
  receivedAt: Date;
}

@Injectable()
export class CallReportsService {
  /** In-memory storage for all call reports. */
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
