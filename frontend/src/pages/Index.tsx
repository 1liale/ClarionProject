
import { useEffect, useState } from 'react';
import { Phone, Clock, MessageSquare, Calendar } from 'lucide-react';
import CallReportsTable from '../components/CallReportsTable';
import StatsCard from '../components/StatsCard';

interface CallReport {
  id: string;
  timestamp: string;
  duration: number;
  userQuestion: string;
  assistantResponse: string;
  status: 'completed' | 'ongoing' | 'failed';
}

const Index = () => {
  const [callReports, setCallReports] = useState<CallReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockData: CallReport[] = [
      {
        id: 'call-001',
        timestamp: '2025-01-15T10:30:00Z',
        duration: 145,
        userQuestion: 'What does Clarion do?',
        assistantResponse: 'Clarion is a leading AI solutions company specializing in intelligent automation and machine learning services for enterprises.',
        status: 'completed'
      },
      {
        id: 'call-002',
        timestamp: '2025-01-15T11:15:00Z',
        duration: 98,
        userQuestion: 'What are your pricing plans?',
        assistantResponse: 'We offer flexible pricing plans starting from our Basic plan at $99/month, Professional at $299/month, and Enterprise solutions with custom pricing.',
        status: 'completed'
      },
      {
        id: 'call-003',
        timestamp: '2025-01-15T12:45:00Z',
        duration: 203,
        userQuestion: 'How can I integrate Clarion with my existing systems?',
        assistantResponse: 'Clarion offers REST APIs, webhooks, and SDKs for popular platforms. Our integration team provides full support during the onboarding process.',
        status: 'completed'
      },
      {
        id: 'call-004',
        timestamp: '2025-01-15T14:20:00Z',
        duration: 67,
        userQuestion: 'Do you offer customer support?',
        assistantResponse: 'Yes, we provide 24/7 customer support through chat, email, and phone. Enterprise customers get dedicated account managers.',
        status: 'completed'
      },
      {
        id: 'call-005',
        timestamp: '2025-01-15T15:10:00Z',
        duration: 156,
        userQuestion: 'What industries do you serve?',
        assistantResponse: 'Clarion serves various industries including healthcare, finance, retail, manufacturing, and technology companies of all sizes.',
        status: 'completed'
      }
    ];

    // Simulate API call delay
    setTimeout(() => {
      setCallReports(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const totalCalls = callReports.length;
  const avgDuration = Math.round(callReports.reduce((acc, call) => acc + call.duration, 0) / totalCalls);
  const completedCalls = callReports.filter(call => call.status === 'completed').length;
  const successRate = Math.round((completedCalls / totalCalls) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Clarion Voice AI Dashboard</h1>
                <p className="text-slate-600 mt-1">Monitor and analyze your voice assistant interactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Calls"
            value={totalCalls.toString()}
            icon={Phone}
            trend="+12%"
            trendUp={true}
          />
          <StatsCard
            title="Avg Duration"
            value={`${avgDuration}s`}
            icon={Clock}
            trend="-5%"
            trendUp={false}
          />
          <StatsCard
            title="Success Rate"
            value={`${successRate}%`}
            icon={MessageSquare}
            trend="+8%"
            trendUp={true}
          />
          <StatsCard
            title="Today's Calls"
            value={totalCalls.toString()}
            icon={Calendar}
            trend="0%"
            trendUp={true}
          />
        </div>

        {/* Call Reports Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <h2 className="text-xl font-semibold text-slate-900">Recent Call Reports</h2>
            <p className="text-slate-600 mt-1">View detailed information about voice assistant interactions</p>
          </div>
          <CallReportsTable reports={callReports} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Index;
