const path = require('path')
const nodeExternals = require('webpack-node-externals')
const { config } = require('dotenv')

config()
const { NODE_ENV } = process.env

module.exports = {
  entry: {
    server: './src/server.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'server.bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: path.resolve(__dirname, 'node_modules/'),
      loader: 'babel-loader',
      query: {
        presets: ['@babel/preset-env']
      }
    }]
  },
  mode: NODE_ENV,
  target: 'node',
  watch: NODE_ENV === 'development',
  externals: [nodeExternals()]
}
