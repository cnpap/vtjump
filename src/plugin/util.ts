export const locationMap = new Map<string, { file: string; startLine: number; endLine: number }>();
let idCounter = 0;

export function generateId(filePath: string, line: number): { id: string; line: number } {
  const id = `vtj-${++idCounter}`;
  locationMap.set(id, {
    file: filePath,
    startLine: line,
    endLine: line,
  });
  return { id, line };
}
