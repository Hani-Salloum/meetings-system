export function correctJSONString(input: string): string {
  // Replace single quotes with double quotes
  if (input && input.length == 0) return "[]";
  const corrected = input.replace(/'/g, '"');

  return corrected;
}
