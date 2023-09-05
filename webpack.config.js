const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { SourceMapDevToolPlugin } = require('webpack');

module.exports = {
	mode: 'development',

	entry: path.resolve(__dirname, 'src/index.js'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		assetModuleFilename: '[name][ext]',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				enforce: 'pre',
				use: ['source-map-loader'],
			},
			{
				test: /\.(png|svg|jpg|jpeg)$/i,
				type: 'asset/resource',
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'webpack',
			filename: 'index.html',
			template: 'src/template.html',
		}),

		new SourceMapDevToolPlugin({
			filename: '[file].map',
		}),
	],
};
