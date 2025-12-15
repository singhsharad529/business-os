// metrics.ts
export const metricsToChartData = (metrics: any[]) =>
  metrics.map((m) => ({
    label: m.templateName,
    total: m.totalCount,
    period: m.contextCount,
    action: m.actionableCount,
  }));

export const metricsSeries = [
  {
    key: "total",
    label: "Total",
    color: "var(--chart-success)",
  },
  {
    key: "period",
    label: "This Period",
    color: "var(--chart-appointment)",
  },
  {
    key: "action",
    label: "Needs Action",
    color: "var(--chart-failed)",
  },
];
