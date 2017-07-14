export default function get (value: any, strPath: string = ''): any {
  if (!strPath) return value
  const paths = strPath.split('.')
  return paths.reduce(
    (value, path) => {
      if (!value) return undefined
      return value[path]
    },
    value
  )
}
