module.exports = {
  app: './example/App.js',

  webpackConfig: {
    loaders: [
      {
        test: /\.(png|ico|jpg|jpeg|gif)$/,
        loader: 'url',
        query: {
          limit: 8192
        }
      },
      {
        test: /\.styl$/,
        loader: 'style!css?sourceMap&modules&localIdentName=[local]__[hash:base64:5]&importLoaders=1!stylus?url resolve',
      },
    ],
  },

  babelLoaderConfig: {
    query: {
      plugins: [ 'transform-decorators-legacy' ]
    }
  }
}
