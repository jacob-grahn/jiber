export default function get (value: any, strPath: string): any {
  const paths = strPath.split('.')
  return paths.reduce(
    (value, path) => value ? value[path] : value,
    value
  )
}
