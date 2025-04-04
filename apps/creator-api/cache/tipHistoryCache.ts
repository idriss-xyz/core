export const tipHistoryCache = new Map<string, number>(); // Mapping: address -> last update timestamp
export const TIP_HISTORY_TTL_MS = 15 * 60 * 1000; // 15 minutes in milliseconds
