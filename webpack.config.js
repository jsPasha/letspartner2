const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  entry: {
    app: __dirname + "/public/js/common.js"
  },
  // devtool: "inline-source-map",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  output: {
    filename: "bundle.js",
    path: __dirname + "/public/dist"
  },
  node: {
    fs: "empty"
  },
  plugins: [
    new UglifyJsPlugin({
      extractComments: true
    })
  ],
};
