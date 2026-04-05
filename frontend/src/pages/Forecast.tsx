import DashboardLayout from '@/components/DashboardLayout';
import GlassCard from '@/components/GlassCard';
import { ChartSkeleton } from '@/components/LoadingSkeleton';
import { useForecast } from '@/hooks/useApi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';



const Forecast = () => {
  const { data, isLoading } = useForecast();
  const forecast = data?.forecast_next_30_days || [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl tracking-tight">Forecast</h1>
          <p className="font-accent text-muted-foreground mt-1">Next 30 days predicted performance</p>
        </div>

        {isLoading ? <ChartSkeleton /> : (
          <GlassCard delay={1}>
            <h2 className="font-label text-sm text-muted-foreground uppercase tracking-wider mb-4">
              Revenue Forecast — Next 30 Days
            </h2>
            <ResponsiveContainer width="100%" height={420}>
              <ComposedChart data={forecast}>
                <defs>
                  <linearGradient id="forecastBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5ed29c" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#5ed29c" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#aaa" interval={4} />
                <YAxis tick={{ fontSize: 12 }} stroke="#aaa" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="upper_bound" stroke="none" fill="url(#forecastBand)" />
                <Area type="monotone" dataKey="lower_bound" stroke="none" fill="transparent" />
                <Line type="monotone" dataKey="predicted_amount" stroke="#5ed29c" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="upper_bound" stroke="#5ed29c" strokeWidth={1} strokeDasharray="4 4" dot={false} strokeOpacity={0.4} />
                <Line type="monotone" dataKey="lower_bound" stroke="#5ed29c" strokeWidth={1} strokeDasharray="4 4" dot={false} strokeOpacity={0.4} />
              </ComposedChart>
            </ResponsiveContainer>
          </GlassCard>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Forecast;
