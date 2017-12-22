/**
 * standardize browser prefixes
 * @hidden
 */
export const prefixFix = () => {
  const w: any = window
  const fields = [
    'RTCPeerConnection',
    'RTCIceCandidate',
    'RTCSessionDescription'
  ]
  fields.forEach(field => {
    w[field] = w[field] || w[`moz${field}`] || w[`webkit${field}`]
  })
}
