const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    en: './src/en.js',
    es: './src/es.js',
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