const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const poststylus = require('poststylus')

module.exports = {
	devtool: 'eval-source-map',
	devServer: {
		contentBase: './build',
		hot: true,
		inline: true,
		progress: true,
		historyApiFallback: true,
		stats: 'errors-only',
		port: 8080,
		host: '127.0.0.1'
	},
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
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
			poststylus(['autoprefixer'])
		]
	}
}
