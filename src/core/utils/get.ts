export default function get (value: any, strPath: string): any {
  const paths = strPath.split('.')
  return paths.reduce(
    (value, path) => {
      if (!value) return undefined
      return value ? value[path] : value
    },
    value
  )
}
