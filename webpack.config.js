const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const poststylus = require('poststylus')
const jeet = require('jeet')

module.exports = {
	devtool: 'eval-source-map',
	devServer: {
		contentBase: './build'
	},
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Investment Counter Factual',
			template: 'index.ejs',
			minify: {
				quoteCharacter: '\'',
				html5: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype: true
			}
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin()
	],
	module: {
		preloaders: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'eslint'
		}],
		loaders: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel'
		},
		{
			test: /\.styl$/,
			exclude: /node_modules/,
			loaders: ['style', 'css', 'stylus']
		},
		{
			test: /\.json$/,
			loader: 'json'
		}]
	},
	stylus: {
		use: [
			jeet(),
			poststylus(['autoprefixer'])
		]
	}
}
