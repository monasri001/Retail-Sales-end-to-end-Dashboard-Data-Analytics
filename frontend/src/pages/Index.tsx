import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { CardSkeleton, ChartSkeleton } from '@/components/LoadingSkeleton';
import { useSalesSummary, useSalesTrends, useAIInsights } from '@/hooks/useApi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';


const kpis = [
  { label: 'Total Revenue', key: 'total_revenue', icon: DollarSign, format: (v: number) => `₹${(v / 1000).toFixed(1)}K` },
  { label: 'Total Orders', key: 'total_orders', icon: ShoppingCart, format: (v: number) => v.toLocaleString() },
  { label: 'Avg Order Value', key: 'avg_order_value', icon: TrendingUp, format: (v: number) => `₹${v.toFixed(2)}` },
];

const Dashboard = () => {
  const { data: summary, isLoading: loadingSummary } = useSalesSummary();
  const { data: trends, isLoading: loadingTrends } = useSalesTrends('monthly');
  const { data: insights } = useAIInsights();

  const s = summary || { total_revenue: 0, total_orders: 0, avg_order_value: 0 };
  const t = trends || [];
  const ins = insights || [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl tracking-tight">Dashboard</h1>
          <p className="font-accent text-muted-foreground mt-1">Overview of your retail performance</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loadingSummary ? (
            Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
          ) : (
            kpis.map((kpi, i) => (
              <GlassCard key={kpi.key} delay={i + 1}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-accent">
                    <kpi.icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <span className="font-label text-xs text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                </div>
                <p className="text-3xl font-heading">{kpi.format((s as Record<string, number>)[kpi.key])}</p>
              </GlassCard>
            ))
          )}
        </div>

        {/* Chart */}
        {loadingTrends ? <ChartSkeleton /> : (
          <GlassCard delay={4}>
            <h2 className="font-label text-sm text-muted-foreground uppercase tracking-wider mb-4">Monthly Revenue</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={t}>
                <defs>
                  <linearGradient id="mintGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5ed29c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5ed29c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#aaa" />
                <YAxis tick={{ fontSize: 12 }} stroke="#aaa" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#5ed29c" strokeWidth={2} fill="url(#mintGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        )}

        {/* AI Insights Preview */}
        <GlassCard delay={5}>
          <h2 className="font-label text-sm text-muted-foreground uppercase tracking-wider mb-4">AI Insights</h2>
          <div className="space-y-3">
            {ins.slice(0, 2).map((item: { insight: string }, i: number) => (
              <div key={i} className="p-3 rounded-xl bg-accent/40 text-sm leading-relaxed">
                {item.insight}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
