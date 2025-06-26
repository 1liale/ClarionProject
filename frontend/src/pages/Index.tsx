import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Phone, Clock, MessageSquare, Calendar } from 'lucide-react';
import CallReportsTable from '../components/CallReportsTable';
import StatsCard from '../components/StatsCard';
import {
  parseISO,
  startOfWeek,
  subWeeks,
  subDays,
  isAfter,
  isBefore,
  startOfDay,
} from 'date-fns';

interface CallReport {
  id: string;
  timestamp: string;
  duration: number;
  userQuestion: string;
  assistantResponse: string;
  status: 'completed' | 'ongoing' | 'failed';
}

const Index = () => {
  // React-Query fetch for call reports
  const {
    data: callReportsRaw = [],
    isLoading: loading,
  } = useQuery({
    queryKey: ['call-reports'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/call-reports');
      if (!res.ok) {
        throw new Error('Failed to fetch call reports');
      }
      return (await res.json()) as {
        callId: string;
        receivedAt: string;
        payload: Record<string, unknown>;
      }[];
    },
    staleTime: 1000 * 60, // 1 min cache
  });

  // Map data to UI shape
  const callReports: CallReport[] = useMemo(
    () =>
      callReportsRaw.map((item) => ({
        id: item.callId,
        timestamp: item.receivedAt,
        duration:
          typeof item.payload?.duration === 'number' ? item.payload.duration : 0,
        userQuestion:
          typeof item.payload?.userQuestion === 'string'
            ? (item.payload.userQuestion as string)
            : 'N/A',
        assistantResponse:
          typeof item.payload?.assistantResponse === 'string'
            ? (item.payload.assistantResponse as string)
            : 'N/A',
        status: 'completed',
      })),
    [callReportsRaw],
  );

  const totalCalls = callReports.length;
  const avgDuration = totalCalls
    ? Math.round(
        callReports.reduce((acc, call) => acc + call.duration, 0) / totalCalls,
      )
    : 0;
  const completedCalls = callReports.filter((call) => call.status === 'completed').length;
  const successRate = totalCalls ? Math.round((completedCalls / totalCalls) * 100) : 0;

  // Calculate trends
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const prevWeekStart = subWeeks(weekStart, 1);
  const prevWeekEnd = subDays(weekStart, 1);

  const isInCurrentWeek = (d: Date) => isAfter(d, weekStart);
  const isInPrevWeek = (d: Date) => isAfter(d, prevWeekStart) && isBefore(d, prevWeekEnd);

  let currWeekCalls = 0;
  let prevWeekCalls = 0;
  let currWeekDuration = 0;
  let prevWeekDuration = 0;
  let currWeekCompleted = 0;
  let prevWeekCompleted = 0;

  const todayStart = startOfDay(now);
  const yesterdayStart = subDays(todayStart, 1);
  let todayCalls = 0;
  let yesterdayCalls = 0;

  callReports.forEach((r) => {
    const date = parseISO(r.timestamp);

    if (isInCurrentWeek(date)) {
      currWeekCalls++;
      currWeekDuration += r.duration;
      if (r.status === 'completed') currWeekCompleted++;
    } else if (isInPrevWeek(date)) {
      prevWeekCalls++;
      prevWeekDuration += r.duration;
      if (r.status === 'completed') prevWeekCompleted++;
    }

    if (isAfter(date, todayStart)) {
      todayCalls++;
    } else if (isAfter(date, yesterdayStart) && isBefore(date, todayStart)) {
      yesterdayCalls++;
    }
  });

  const pctChange = (curr: number, prev: number): { pct?: string; up?: boolean } => {
    if (prev === 0) return {};
    const diff = ((curr - prev) / prev) * 100;
    return { pct: `${Math.abs(diff).toFixed(0)}%`, up: diff >= 0 };
  };

  const totalTrend = pctChange(currWeekCalls, prevWeekCalls);
  const avgDurTrend = pctChange(
    currWeekDuration / Math.max(currWeekCalls, 1),
    prevWeekDuration / Math.max(prevWeekCalls, 1),
  );
  const successTrend = pctChange(
    currWeekCompleted / Math.max(currWeekCalls, 1),
    prevWeekCompleted / Math.max(prevWeekCalls, 1),
  );
  const todayTrend = pctChange(todayCalls, yesterdayCalls);

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
            trend={totalTrend.pct}
            trendUp={totalTrend.up}
          />
          <StatsCard
            title="Avg Duration"
            value={`${avgDuration}s`}
            icon={Clock}
            trend={avgDurTrend.pct}
            trendUp={avgDurTrend.up}
          />
          <StatsCard
            title="Success Rate"
            value={`${successRate}%`}
            icon={MessageSquare}
            trend={successTrend.pct}
            trendUp={successTrend.up}
          />
          <StatsCard
            title="Today's Calls"
            value={todayCalls.toString()}
            icon={Calendar}
            trend={todayTrend.pct}
            trendUp={todayTrend.up}
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
