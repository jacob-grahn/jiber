export default function set (obj: any, strPath: string, value: any): any {
  if (!strPath) return value
  const paths = strPath.split('.')
  return setRecursive(obj, paths, value)
}

function setRecursive (obj: any, paths: string[], value: any): any {
  if (paths.length === 0) return value
  const [path, ...remainingPaths] = paths
  const oldPathValue = obj[path] || {}
  const newPathValue = setRecursive(oldPathValue, remainingPaths, value)

  if (Array.isArray(obj)) {
    const numPath = Number(path)
    const newArr = [...obj]
    newArr[numPath] = newPathValue
    return newArr
  } else {
    return {...obj, [path]: newPathValue}
  }
}
