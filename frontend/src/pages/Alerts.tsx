import DashboardLayout from '@/components/DashboardLayout';
import GlassCard from '@/components/GlassCard';
import { useAlerts } from '@/hooks/useApi';
import { AlertTriangle, TrendingDown, Package } from 'lucide-react';


const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  LOW_STOCK: { icon: Package, color: 'text-destructive', bg: 'bg-destructive/10' },
  SALES_DROP: { icon: TrendingDown, color: 'text-orange-500', bg: 'bg-orange-50' },
  INACTIVE_CUSTOMERS: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
};

const severityBadge: Record<string, string> = {
  high: 'bg-destructive/15 text-destructive',
  medium: 'bg-orange-100 text-orange-600',
  low: 'bg-muted text-muted-foreground',
};

const Alerts = () => {
  const { data } = useAlerts();
  const alerts = data || [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl tracking-tight">Alerts</h1>
          <p className="font-accent text-muted-foreground mt-1">System notifications & warnings</p>
        </div>

        <div className="space-y-4">
          {alerts.map((alert: any, i: number) => {
            const config = typeConfig[alert.type] || typeConfig.LOW_STOCK;
            const Icon = config.icon;
            return (
              <GlassCard key={i} delay={Math.min(i + 1, 6)}>
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${config.bg} shrink-0`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-label text-xs uppercase tracking-wider">{alert.type.replace('_', ' ')}</span>
                      {alert.severity && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-label uppercase ${severityBadge[alert.severity] || severityBadge.low}`}>
                          {alert.severity}
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80">{alert.message}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
