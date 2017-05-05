export default function isFunction (obj: any) {
  return !!(obj && obj.constructor && obj.call && obj.apply)
}
