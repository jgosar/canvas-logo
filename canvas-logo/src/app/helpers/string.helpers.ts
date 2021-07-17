export function replaceAll(text: string, replaceThis: string, withThis: string): string {
  return text.split(replaceThis).join(withThis);
}
