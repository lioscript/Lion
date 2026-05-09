export function serializeDates<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const val = (obj as Record<string, unknown>)[key];
    result[key] = val instanceof Date ? val.toISOString() : val;
  }
  return result;
}
