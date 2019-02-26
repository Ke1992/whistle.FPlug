//库
const path = require('path');
//配置
const appRoot = '/plugin.fplug';
const pageConfig = require('./page.config');
//插件
const HtmlWebpackPlugin = require('html-webpack-plugin'); //根据模板生成对应的html文件
//TODO: 替换该插件为MiniCssExtractPlugin？
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //将css单独提取成文件

module.exports = {
	entry: pageConfig.entry,
	output: {
		//根据entry的key值来生成对应name
		filename: 'js/[name].js',
		path: path.resolve(__dirname, '../public'),
		publicPath: appRoot + '/' //为所有的资源都添加一个前缀，然后再接上资源对应转换出来的路径
	},
	plugins: (() => {
		const plugins = [];

		//根据模板生成对应的html文件
		pageConfig.plugins.forEach((ceil) => {
			plugins.push(new HtmlWebpackPlugin(ceil));
		});

		//将css单独提取成文件
		//TODO: 一个entry对应一个css文件，后面研究一下怎么实现一个entry对应多个css文件)
		plugins.push(new ExtractTextPlugin({
			filename: 'css/[name].css' //指定文件名称，同时可以指定路径
		}));

		return plugins;
	})(),
	module: {
		//rules、use的执行顺序是最后一个先执行
		rules: [{
			//js处理
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/, //表示哪些目录中的 .js 文件不要进行 babel-loader
			use: [{
				//TODO: 如果要配置babel的转换选项，该怎么配置？
				loader: 'babel-loader',
				options: {
					//配置项可以写到.babelrc文件中去
					presets: [
						'@babel/preset-env', //根据目标浏览器来自动使用babel插件，例如自动启用babel-preset-es2015等
						'@babel/preset-react' //用来转换react
					]
				}
			}]
		}, {
			//css处理
			test: /\.(scss|css)$/,
			use: ExtractTextPlugin.extract({
				//降级处理
				fallback: 'style-loader', //style-loader: 将css插入到页面的style标签
				use: [{
					loader: 'css-loader', //The css-loader interprets @import and url() like import/require() and will resolve them
					options: {
						importLoaders: 1
					}
				}, {
					loader: 'postcss-loader', //css后处理器，暂时只引入了autoprefixer
					options: {
						config: {
							path: 'config/postcss.config.js' //配置项路径
						}
					}
				}, {
					loader: 'sass-loader' // 将 Sass 编译成 CSS
				}],
				publicPath: '../' //调整url等的路径级别
			})
		}, {
			//图片处理
			test: /\.(png|jpg|gif)$/,
			use: {
				//file-loader的作用就是将要加载的文件复制到指定目录，而url-loader是对file-loader的封装，增加了limit的功能
				//其中url-loader依赖file-loader
				loader: 'url-loader',
				options: {
					limit: 1024, //限制多大以内的图片直接使用DataURL
					name: '[name].[ext]', //默认名称是MD5哈希值，配置name参数指定文件名称
					outputPath: 'images/' //指定输出的目录(也可以直接在name中指定)
				}
			}
		}, {
			//字体处理
			test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
			use: {
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'fonts/'
				}
			}
		}]
	}
};