"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetInsight } from "@/types/budget";
import {
  AlertCircle,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface SpendingInsightsProps {
  insights: BudgetInsight[];
  className?: string;
}

function InsightIcon({ type }: { type: BudgetInsight["type"] }) {
  switch (type) {
    case "warning":
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    case "info":
      return <AlertTriangle className="h-5 w-5 text-warning" />;
    case "success":
      return <TrendingDown className="h-5 w-5 text-success" />;
    default:
      return null;
  }
}

function InsightItem({ insight }: { insight: BudgetInsight }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-4">
      <InsightIcon type={insight.type} />
      <div className="space-y-1">
        <p className="font-medium">{insight.message}</p>
        {insight.details && (
          <div className="text-sm text-muted-foreground">
            <p>Current: ${insight.details.current.toFixed(2)}</p>
            <p>Limit: ${insight.details.limit.toFixed(2)}</p>
            <p>Remaining: ${insight.details.remaining.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function SpendingInsights({
  insights,
  className,
}: SpendingInsightsProps) {
  // Group insights by type for better organization
  const warningInsights = insights.filter((i) => i.type === "warning");
  const infoInsights = insights.filter((i) => i.type === "info");
  const successInsights = insights.filter((i) => i.type === "success");

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Priority order: warnings first, then info, then success */}
        {warningInsights.map((insight, index) => (
          <InsightItem key={`warning-${index}`} insight={insight} />
        ))}
        {infoInsights.map((insight, index) => (
          <InsightItem key={`info-${index}`} insight={insight} />
        ))}
        {successInsights.map((insight, index) => (
          <InsightItem key={`success-${index}`} insight={insight} />
        ))}
      </CardContent>
    </Card>
  );
}
