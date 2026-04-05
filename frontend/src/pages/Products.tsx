import DashboardLayout from '@/components/DashboardLayout';
import GlassCard from '@/components/GlassCard';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { useTopProducts, useDeadStock } from '@/hooks/useApi';
import { AlertTriangle } from 'lucide-react';


const Products = () => {
  const { data: top, isLoading: loadingTop } = useTopProducts();
  const { data: dead, isLoading: loadingDead } = useDeadStock();
  const topProducts = top || [];
  const deadStock = dead || [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl tracking-tight">Products <span className="text-sm font-accent text-muted-foreground ml-2">(Total: {topProducts.length + deadStock.length})</span></h1>
          <p className="font-accent text-muted-foreground mt-1">Top performers & inventory alerts</p>
        </div>

        {loadingTop ? <TableSkeleton /> : (
          <GlassCard delay={1}>
            <h2 className="font-label text-sm text-muted-foreground uppercase tracking-wider mb-4">Top Products</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 font-label text-xs text-muted-foreground uppercase">Product</th>
                    <th className="text-left py-3 font-label text-xs text-muted-foreground uppercase">Category</th>
                    <th className="text-right py-3 font-label text-xs text-muted-foreground uppercase">Qty Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p: any) => (
                    <tr key={p.product_id} className="border-b border-border/30 hover:bg-accent/30 transition-colors">
                      <td className="py-3 font-medium">{p.name}</td>
                      <td className="py-3"><span className="px-2 py-1 rounded-full bg-accent text-accent-foreground text-xs font-label">{p.category}</span></td>
                      <td className="py-3 text-right">{p.total_quantity_sold?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

        {loadingDead ? <CardSkeleton /> : (
          <div>
            <h2 className="font-label text-sm text-muted-foreground uppercase tracking-wider mb-4">Dead Stock Alerts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {deadStock.map((item: any) => (
                <GlassCard key={item.product_id} delay={3} className="border-destructive/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-destructive/10">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                      <p className="text-xs text-destructive mt-1 font-label">Stock: {item.stock} | Sold: {item.quantity}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const CardSkeleton = () => <div className="glass-card p-6 animate-pulse"><div className="h-16 bg-muted rounded-lg" /></div>;

export default Products;
