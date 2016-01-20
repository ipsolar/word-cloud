/**
 * Build configuration.
 *
 * This will build the app with the result in the dist/ folder
 * Javascript dependencies are built to a separate file as are css
 * and the main html file.
 *
 * The main entry point for the application is src/index.jsx
 */

var webpack = require('webpack');

var filename;
var vendorName;
var plugins = [];

if(process.env.BUNDLE_DEPS) {
  filename = 'word_cloud.all.js';
} else {
  filename = 'word_cloud.js';
  vendorName = 'word_cloud.deps.js';
  plugins.push(
    new webpack.optimize.CommonsChunkPlugin('vendor', vendorName)
  );
}

if(process.env.MINIFY) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
  );
}

module.exports = {
  context: __dirname,
  entry: {
    main: './index.js',
    vendor: ['react', 'd3', 'lodash']
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    filename: filename
  },
  debug: true,
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          /node_modules\/keyword_in_context/,
          /src/,
          /index.js/
        ],
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
          plugins: ['transform-runtime']
        }
      },
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]"
      },
      {
        test: /\.css$/,
        loader: "style!css"
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: plugins
};
