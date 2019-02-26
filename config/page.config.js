const common = 'common';
const header = 'header';
const footer = 'footer';
const pages = [
	//首页
	['index', 'invade', 'demo'],
	//错误页
	['error']
];

module.exports = (() => {
	const entry = {
		common: `./src/${common}.js`,
		header: `./src/${header}.js`
	};
	const plugins = [];

	pages.forEach(ceil => {
		ceil.forEach(item => {
			entry[item] = `./src/pages/${item}.js`;

			//设置输出页面插件配置
			plugins.push({
				chunks: ['common', 'header', item, 'footer'], //该文件包含哪些entry
				filename: `../views/${item}.ejs`, //指定文件名称，同时可以指定路径
				template: './src/common/template.html'
			});
		});
	});
	entry[footer] = `./src/${footer}.js`;

	return {
		entry,
		plugins
	}
})();