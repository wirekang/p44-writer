import type { Priority } from "p44-types";

export function sortByPriority<T extends { priority: Priority }>(
  arr: T[],
): T[] {
  return [...arr].sort((a, b) => a.priority - b.priority);
}
