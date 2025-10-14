import React from 'react';
import { Card, CardContent } from '../ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';

interface StatTileProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  loading?: boolean;
}

export function StatTile({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconBg = 'bg-primary/10',
  iconColor = 'text-primary',
  loading = false,
}: StatTileProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
              <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
            </div>
            <div className="h-12 w-12 bg-muted rounded-xl animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl">{value}</h3>
              {change && (
                <span
                  className={cn(
                    'text-sm',
                    changeType === 'positive' && 'text-secondary',
                    changeType === 'negative' && 'text-destructive',
                    changeType === 'neutral' && 'text-muted-foreground'
                  )}
                >
                  {change}
                </span>
              )}
            </div>
          </div>
          <div className={cn('p-3 rounded-xl', iconBg)}>
            <Icon className={cn('h-6 w-6', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
