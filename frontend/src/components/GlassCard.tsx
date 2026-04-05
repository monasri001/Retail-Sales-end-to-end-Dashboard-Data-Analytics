import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const GlassCard = ({ children, className, delay = 0 }: GlassCardProps) => {
  const delayClass = delay > 0 && delay <= 6 ? `animate-entry-${delay}` : '';
  return (
    <div className={cn('glass-card p-6 animate-entry', delayClass, className)}>
      {children}
    </div>
  );
};

export default GlassCard;
