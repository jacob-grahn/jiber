export default function del (obj: any, strPath: string): any {
  if (!strPath) return undefined
  const paths = strPath.split('.')
  return delRecursive(obj, paths)
}

function delRecursive (obj: any, paths: string[]): any {
  if (!obj) return undefined
  if (paths.length === 0) return undefined
  const [path, ...remainingPaths] = paths

  if (paths.length === 1) {
    if (Array.isArray(obj)) {
      return obj.slice(obj.length - 1)
    } else {
      const newObj = {...obj}
      delete newObj[path]
      return newObj
    }
  }

  const oldPathValue = obj[path]
  const newPathValue = delRecursive(oldPathValue, remainingPaths)

  if (Array.isArray(obj)) {
    const numPath = Number(path)
    const newArr = [...obj]
    newArr[numPath] = newPathValue
    return newArr
  } else {
    return {...obj, [path]: newPathValue}
  }
}
