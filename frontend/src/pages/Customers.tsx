import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import GlassCard from '@/components/GlassCard';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { useCustomerSegments } from '@/hooks/useApi';



const segmentColors: Record<string, string> = {
  Champion: 'bg-primary/20 text-primary',
  Loyal: 'bg-accent text-accent-foreground',
  'At Risk': 'bg-destructive/15 text-destructive',
  Lost: 'bg-muted text-muted-foreground',
  Potential: 'bg-primary/10 text-primary',
};

const Customers = () => {
  const { data, isLoading } = useCustomerSegments();
  const customers = data || [];
  const [filter, setFilter] = useState('All');
  const segments = ['All', ...new Set(customers.map((c: any) => c.segment))];
  const filtered = filter === 'All' ? customers : customers.filter((c: any) => c.segment === filter);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl tracking-tight">Customers</h1>
          <p className="font-accent text-muted-foreground mt-1">Customer segmentation & behavior</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {segments.map(s => (
            <button key={s} onClick={() => setFilter(s)} className={s === filter ? 'btn-primary text-xs' : 'btn-secondary text-xs'}>
              {s}
            </button>
          ))}
        </div>

        {isLoading ? <TableSkeleton /> : (
          <GlassCard delay={1}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    {['Customer', 'Recency', 'Frequency', 'Monetary', 'Segment'].map(h => (
                      <th key={h} className="text-left py-3 font-label text-xs text-muted-foreground uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c: any) => (
                    <tr key={c.customer_id} className="border-b border-border/30 hover:bg-accent/30 transition-colors">
                      <td className="py-3 font-medium">{c.customer_id}</td>
                      <td className="py-3">{c.recency_days}d ago</td>
                      <td className="py-3">{c.frequency}x</td>
                      <td className="py-3">₹{c.monetary.toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-label ${segmentColors[c.segment] || 'bg-muted text-muted-foreground'}`}>
                          {c.segment}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Customers;
