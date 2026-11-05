import * as React from 'react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type StatCardProps = React.ComponentProps<typeof Card> & {
  /** Short label shown above the value, e.g. "Revenue". */
  label: React.ReactNode;
  /** The headline value. Pass a formatted string or any node. */
  value: React.ReactNode;
  /** Percentage change. Positive renders green, negative renders red. */
  delta?: number;
  /** Text after the delta, e.g. "vs last month". */
  deltaLabel?: React.ReactNode;
  /** Optional icon rendered in the top-right corner. */
  icon?: React.ReactNode;
};

function formatDelta(delta: number) {
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta.toFixed(1)}%`;
}

function StatCard({ label, value, delta, deltaLabel, icon, className, ...props }: StatCardProps) {
  const trend = delta === undefined ? undefined : delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <Card data-slot="stat-card" data-trend={trend} className={cn('gap-2', className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        {icon ? <span className="text-muted-foreground [&_svg]:size-4">{icon}</span> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <div className="text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
        {trend ? (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-medium',
                trend === 'up' && 'text-emerald-600 dark:text-emerald-400',
                trend === 'down' && 'text-red-600 dark:text-red-400',
              )}
            >
              <TrendIcon className="size-3.5" aria-hidden />
              {formatDelta(delta as number)}
            </span>
            {deltaLabel}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { StatCard };
