// calls.ts
export const callData = [
  { label: "Mon", success: 120, appointment: 80, failed: 30 },
  { label: "Tue", success: 150, appointment: 95, failed: 40 },
  { label: "Wed", success: 170, appointment: 110, failed: 35 },
  { label: "Thu", success: 140, appointment: 90, failed: 50 },
  { label: "Fri", success: 190, appointment: 130, failed: 45 },
  { label: "Sat", success: 110, appointment: 70, failed: 60 },
  { label: "Sun", success: 90, appointment: 55, failed: 25 },
];

export const callSeries = [
  {
    key: "success",
    label: "Successful",
    gradient: {
      start: "var(--chart-gradient-start)",
      end: "var(--chart-gradient-end)",
    },
  },
  {
    key: "appointment",
    label: "Appointment",
    gradient: {
      start: "var(--chart-gradient-success-start)",
      end: "var(--chart-gradient-success-end)",
    },
  },
  {
    key: "failed",
    label: "Failed",
    gradient: {
      start: "var(--chart-gradient-danger-start)",
      end: "var(--chart-gradient-danger-end)",
    },
  },
];
