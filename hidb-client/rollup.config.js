import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'dist/es6/index.js',
  output: {
    file: 'dist/hidb-client.bundle.js',
    format: 'umd',
    name: 'HiDBClient'
  },
  plugins: [
    resolve()
  ]
}
