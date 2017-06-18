import webpack from 'webpack'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'


const NODE_ENV = process.env.NODE_ENV
const outputPath = NODE_ENV === 'production' ? './lib/index.js' : './example/cover-editor.js'

const globals = {
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
}


export default {
  entry: './src/index',

  output: {
    filename: outputPath,
    libraryTarget: 'umd',
    library: 'CoverEditor',
  },
  
  module: {
    rules: [
      { 
        test: /\.js$/, 
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  },
  
  plugins: [
    new webpack.DefinePlugin(globals),
    ...(
      process.env.NODE_ENV === 'production' ? [
        new UglifyJsPlugin({
          comments: false,
          compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            warnings: false,
            screw_ie8: true,
          },
        }),
      ] : []
    ),
  ]
}
