import DashboardLayout from '@/components/DashboardLayout';
import GlassCard from '@/components/GlassCard';
import { useAIInsights } from '@/hooks/useApi';
import { Brain } from 'lucide-react';


const highlightKeywords = (text: string) => {
  const keywords = ['revenue', 'increased', 'churn', 'risk', 'dead stock', 'peak', 'growth', 'surge', 'elevated', 'optimize', 'grown', 'effectively'];
  let result = text;
  keywords.forEach(kw => {
    const regex = new RegExp(`(${kw})`, 'gi');
    result = result.replace(regex, `<mark class="bg-accent text-accent-foreground px-1 rounded font-medium">$1</mark>`);
  });
  return result;
};

const AIInsights = () => {
  const { data } = useAIInsights();
  const insights = data || [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl tracking-tight">AI Insights</h1>
          <p className="font-accent text-muted-foreground mt-1">Intelligent analysis of your retail data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((item: { insight: string }, i: number) => (
            <GlassCard key={i} delay={Math.min(i + 1, 6)}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-accent shrink-0">
                  <Brain className="h-5 w-5 text-accent-foreground" />
                </div>
                <p
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: highlightKeywords(item.insight) }}
                />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIInsights;
