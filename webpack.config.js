var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },

  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel'
      }, {
	      	test: /\.css$/,
	      	loaders: ['style', 'css']
	    }, {
	      	test: /\.scss$/,
	      	loaders: ['style', 'css', 'postcss', 'sass']
	    }, {
	      	test: /\.less$/,
	      	loaders: ['style', 'css', 'less']
	    }, {
	      	test: /\.woff$/,
	      	loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]"
	    }, {
	      	test: /\.woff2$/,
	      	loader: "url-loader?limit=10000&mimetype=application/font-woff2&name=[path][name].[ext]"
	    }, {
	      	test: /\.(eot|ttf|svg|gif|png)$/,
	      	loader: "file-loader"
	    }
    ]
  }
  
};

module.exports = config;