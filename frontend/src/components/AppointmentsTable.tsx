import { CalendarCheck2, ClipboardList } from 'lucide-react';
import { useState } from 'react';

export interface Appointment {
  id: string;
  callId: string;
  date: string; // ISO date
  time: string; // HH:mm
  patientName: string;
  notes?: string;
  createdAt: string;
}

interface Props {
  appointments: Appointment[];
  loading: boolean;
}

const AppointmentsTable = ({ appointments, loading }: Props) => {
  const [showNotes, setShowNotes] = useState<Record<string, boolean>>({});

  if (loading) {
    return (
      <div className="p-8 animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 rounded w-full" />
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="p-8 text-center text-slate-600 flex items-center justify-center gap-2">
        <ClipboardList className="h-5 w-5" /> No appointments yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Call</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">When</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Notes</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {appointments.map((appt) => (
            <tr key={appt.id} className="hover:bg-slate-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{appt.id.slice(0, 8)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{appt.callId.slice(0, 8)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 flex items-center gap-1">
                <CalendarCheck2 className="h-4 w-4 text-slate-400" />
                {appt.date} {appt.time}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{appt.patientName}</td>
              <td className="px-6 py-4 whitespace-pre-wrap text-sm max-w-xs">
                {appt.notes ? (
                  <>
                    {showNotes[appt.id] ? appt.notes : appt.notes.slice(0, 60)}
                    {appt.notes.length > 60 && (
                      <button
                        onClick={() =>
                          setShowNotes((p) => ({ ...p, [appt.id]: !p[appt.id] }))
                        }
                        className="ml-2 text-xs text-blue-600 hover:underline"
                      >
                        {showNotes[appt.id] ? 'less' : 'more'}
                      </button>
                    )}
                  </>
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsTable; 