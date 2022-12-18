const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    en: './src/index.js',
    es: './src/index.js',
  },
  output: {
    filename: '[name]/bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  }
};