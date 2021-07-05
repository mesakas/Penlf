/*
 * @Author: your name
 * @Date: 2021-07-05 18:08:34
 * @LastEditTime: 2021-07-05 18:39:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Penlf\webpack.config.js
 */

const path = require('path');

module.exports = {
  mode:"production",
  entry: './src/Penlf.js',
  output: {
    filename: 'Penlf.js',
    path: path.resolve(__dirname, 'dist'),
    
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }]
  },
};