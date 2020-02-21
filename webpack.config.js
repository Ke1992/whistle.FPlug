const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        index: './src/client/pages/index.tsx',
        invade: './src/client/pages/invade.tsx',
    },
    output: {
        // 根据entry的key值来生成对应name
        filename: 'javascripts/[name].js',
        path: path.resolve(__dirname, './public'),
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    externals: { // 外部扩展
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    plugins: [
        // index页面
        new HtmlWebpackPlugin({
            chunks: ['index'], // 该文件包含哪些entry
            filename: './index.html', // 指定文件名称，同时可以指定路径
            template: './src/client/template.html',
        }),
        // invade页面
        new HtmlWebpackPlugin({
            chunks: ['invade'], // 该文件包含哪些entry
            filename: './invade.html', // 指定文件名称，同时可以指定路径
            template: './src/client/template.html',
        }),
        // 提取css成单独文件
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
        // 复制文件到发布目录
        new CopyWebpackPlugin([{
            from: './node_modules/react/umd/react.production.min.js',
            to: 'javascripts/common/react.min.js',
        }, {
            from: './node_modules/react-dom/umd/react-dom.production.min.js',
            to: 'javascripts/common/react-dom.min.js',
        }, {
            from: './src/client/assets/css/**/*',
            to: 'css',
            transformPath(targetPath) {
                // 修改复制的目标路径
                return targetPath.replace('src/client/assets/css/', 'common/');
            },
        }, {
            from: './src/client/assets/webfonts/**/*',
            to: 'webfonts',
            transformPath(targetPath) {
                // 修改复制的目标路径
                return targetPath.replace('src/client/assets/webfonts/', '');
            },
        }]),
    ],
    module: {
        rules: [{
            // tsx处理
            test: /\.tsx?$/,
            loader: 'ts-loader',
            options: {
                configFile: path.resolve(__dirname, './src/client/tsconfig.json'),
            },
        }, {
            // scss处理
            test: /\.(sa|sc|c)ss$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader', // css后处理器，暂时只引入了autoprefixer
                'sass-loader',
            ],
        }, {
            // 图片处理
            test: /\.(png|jpg|gif)$/,
            use: {
                // file-loader的作用就是将要加载的文件复制到指定目录，而url-loader是对file-loader的封装，增加了limit的功能
                // 其中url-loader依赖file-loader
                loader: 'url-loader',
                options: {
                    limit: 1024, // 限制多大以内的图片直接使用DataURL
                    name: '[name].[ext]', // 默认名称是MD5哈希值，配置name参数指定文件名称
                    outputPath: 'images/', // 指定输出的目录(也可以直接在name中指定)
                },
            },
        }],
    },
};
