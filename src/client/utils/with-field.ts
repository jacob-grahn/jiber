/**
 * Return objects that match a specified field
 */
export default function withField (
  list: any[],
  key: string,
  value: string
): any[] {
  if (!list) return []
  return list.filter(item => item && item[key] === value)
}
