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
    gradient: {
      start: "var(--chart-gradient-start)",
      end: "var(--chart-gradient-end)",
    },
  },
  {
    key: "period",
    label: "This Period",
    gradient: {
      start: "var(--chart-gradient-success-start)",
      end: "var(--chart-gradient-success-end)",
    },
  },
  {
    key: "action",
    label: "Needs Action",
    gradient: {
      start: "var(--chart-gradient-danger-start)",
      end: "var(--chart-gradient-danger-end)",
    },
  },
];
