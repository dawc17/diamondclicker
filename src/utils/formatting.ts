/**
 * Formats a number to a readable format with letter suffixes
 * Examples:
 * 999999 -> 999999
 * 1000000 -> 1M
 * 1500000 -> 1.5M
 * 1000000000 -> 1B
 * 1500000000000 -> 1.5T
 *
 * @param value The number to format
 * @param decimals Number of decimal places (default: 1)
 * @returns Formatted string
 */
export const formatNumber = (value: number, decimals: number = 1): string => {
  // For all numbers, limit decimal places
  if (value < 1000000) {
    // Always show the specified number of decimal places if decimals > 0
    if (decimals > 0) {
      return value.toFixed(decimals);
    }
    // If decimals = 0, just return the integer value
    return Math.round(value).toString();
  }

  const suffixes = [
    "",
    "K",
    "M",
    "B",
    "T",
    "Qa",
    "Qi",
    "Sx",
    "Sp",
    "Oc",
    "No",
    "Dc",
  ];

  // Determine the appropriate suffix
  const tier = Math.floor(Math.log10(Math.abs(value)) / 3);

  // Don't go beyond our defined suffixes
  const suffix = tier < suffixes.length ? suffixes[tier] : `e${tier * 3}`;

  // Scale the number
  const scaled = value / Math.pow(10, tier * 3);

  // If decimals > 0, always show the decimal places
  if (decimals > 0) {
    return `${scaled.toFixed(decimals)}${suffix}`;
  }

  // Otherwise just round to an integer
  return `${Math.round(scaled)}${suffix}`;
};
