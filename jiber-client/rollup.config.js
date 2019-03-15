import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'dist/es6/index.js',
  output: {
    file: 'dist/jiber-client.bundle.js',
    format: 'umd',
    name: 'JiberClient'
  },
  plugins: [
    resolve()
  ]
}
