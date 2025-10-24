export function formatHashOrAddress(
  value: string,
  visibleChars: number = 6
): string {
  if (!value || typeof value !== "string") return "";

  // If it's shorter than twice the visible chars, return as is
  if (value.length <= visibleChars * 2) return value;

  const prefix = value.slice(0, visibleChars);
  const suffix = value.slice(-visibleChars);

  return `${prefix}...${suffix}`;
}
