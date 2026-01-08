// utils/date.ts
export const formatDateDDMMYYYY = (isoDateTime: string): string => {
  if (!isoDateTime) return "";

  // Extract date part only (avoid Date + timezone issues)
  const [datePart] = isoDateTime.split("T"); // YYYY-MM-DD
  const [year, month, day] = datePart.split("-");

  return `${day}/${month}/${year}`;
};
