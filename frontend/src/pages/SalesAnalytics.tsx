import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import GlassCard from '@/components/GlassCard';
import { ChartSkeleton } from '@/components/LoadingSkeleton';
import { useSalesTrends } from '@/hooks/useApi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const periods = ['daily', 'weekly', 'monthly'] as const;

const SalesAnalytics = () => {
  const [period, setPeriod] = useState<string>('daily');
  const { data, isLoading } = useSalesTrends(period);
  const chartData = data || [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl tracking-tight">Sales Analytics</h1>
          <p className="font-accent text-muted-foreground mt-1">Track revenue trends over time</p>
        </div>

        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={p === period ? 'btn-primary text-xs' : 'btn-secondary text-xs'}
            >
              {p}
            </button>
          ))}
        </div>

        {isLoading ? <ChartSkeleton /> : (
          <GlassCard delay={1}>
            <h2 className="font-label text-sm text-muted-foreground uppercase tracking-wider mb-4">
              {period.charAt(0).toUpperCase() + period.slice(1)} Revenue
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5ed29c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5ed29c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#aaa" />
                <YAxis tick={{ fontSize: 12 }} stroke="#aaa" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#5ed29c" strokeWidth={2} fill="url(#salesGrad)" animationDuration={600} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SalesAnalytics;
