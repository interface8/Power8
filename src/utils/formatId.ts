export const formatId = (id: string, prefix: string = "ORD"): string => {
  if (!id) return "";
  
  // If it already has a prefix pattern, return as is
  if (id.includes(`${prefix}-`)) return id;
  
  // Extract last 4-6 characters for readability
  const suffix = id.slice(-3).toUpperCase();
  
  return `${prefix}-${suffix}`;
};

/**
 * Format order ID specifically
 */
export const formatOrderId = (id: string): string => {
  return formatId(id, "ORD");
};

/**
 * Format credit account ID specifically
 */
export const formatCreditId = (id: string): string => {
  return formatId(id, "CRD");
};