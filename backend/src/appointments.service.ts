import { Injectable } from '@nestjs/common';

export interface Appointment {
  /** Unique identifier for the appointment (same id Vapi passes). */
  id: string;
  /** Call id that triggered the scheduling. */
  callId: string;
  /** ISO-formatted date, e.g. 2025-06-30. */
  date: string;
  /** 24-hour time string, e.g. 15:00. */
  time: string;
  /** Name of the patient / caller. */
  patientName: string;
  /** Optional free-text notes. */
  notes?: string;
  /** Timestamp when stored on our server. */
  createdAt: Date;
}

@Injectable()
export class AppointmentsService {
  /** In-memory demo storage. Replace with DB for production. */
  private readonly appointments: Appointment[] = [];

  add(appointment: Omit<Appointment, 'createdAt'>): void {
    this.appointments.push({ ...appointment, createdAt: new Date() });
  }

  findAll(): Appointment[] {
    // Return shallow copy to prevent mutations.
    return [...this.appointments];
  }
} 