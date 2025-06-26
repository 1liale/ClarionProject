import { Clock, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface CallReport {
  id: string;
  timestamp: string;
  duration: number;
  userQuestion: string;
  assistantResponse: string;
  status: 'completed' | 'ongoing' | 'failed';
}

interface CallReportsTableProps {
  reports: CallReport[];
  loading: boolean;
}

const CallReportsTable = ({ reports, loading }: CallReportsTableProps) => {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ongoing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'ongoing':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const ExpandableCell = ({ text }: { text: string }) => {
    const [open, setOpen] = useState(false);
    if (!text || text === 'N/A') return <span className="text-slate-500">N/A</span>;
    return (
      <div className="w-full">
        <textarea
          readOnly
          rows={open ? Math.min(8, text.split('\n').length + 1) : 1}
          className="w-full resize-none bg-transparent border border-slate-200 rounded-md px-2 py-1 text-sm leading-snug focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 overflow-hidden"
          style={{ cursor: 'pointer' }}
          value={text}
          onClick={() => setOpen((o) => !o)}
        />
        <div className="text-right mt-1">
          <button
            type="button"
            className="text-xs text-blue-600 hover:underline"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="p-12 text-center">
        <MessageCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">No call reports yet</h3>
        <p className="text-slate-600">Call reports will appear here once your voice assistant starts receiving calls.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Call ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                User Question
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Assistant Response
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {reports.map((report, index) => (
              <tr 
                key={report.id} 
                className="hover:bg-slate-50 transition-colors duration-150 ease-in-out"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {report.id.split('-')[1]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-slate-900">{report.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{formatTimestamp(report.timestamp)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-slate-400 mr-2" />
                    <span className="text-sm text-slate-900">{formatDuration(report.duration)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(report.status)}
                    <span className={getStatusBadge(report.status)}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <ExpandableCell text={report.userQuestion} />
                </td>
                <td className="px-6 py-4 max-w-md">
                  <ExpandableCell text={report.assistantResponse} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CallReportsTable;
