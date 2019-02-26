//库
const koa = require('koa');
const path = require('path');
const views = require('koa-views');
const serve = require('koa-static');
//全局变量
const app = new koa();
const router = path.join(__dirname, '../router/');
//是否第一次进入
let isFirstEnter = true;

module.exports = function(server, options) {
	//重置缓存
	isFirstEnter && initCache(options);
	//注册中间件
	initApp(options);
	//监听request请求
	server.on('request', app.callback());
};

/**
 * 注册中间件
 */
function initApp({
	storage
}) {
	//静态资源
	app.use(serve(path.join(__dirname, '../public')));
	//加载ejs引擎
	app.use(views(path.join(__dirname, '../views'), {
		extension: 'ejs'
	}));
	//异常路由
	app.use(async (ctx, next) => {
		try {
			await next();
		} catch (err) {
			//统一到404页面，同时输出错误信息
			await ctx.render('error', {
				data: encodeURI(err.stack || err)
			});
			//通知一下onerror监听者，方便错误记录
			ctx.app.emit('error', err, ctx);
		}
	});
	//正常的路由
	app.use(async ctx => {
		//拆分路由
		const pathArr = ctx.path.replace(new RegExp('^/plugin.fplug'), '').split('/').slice(1);

		//默认加载首页
		!pathArr.length && pathArr.push('index', 'init');

		//设置whistle的插件数据储存对象
		ctx.storage = storage;

		//加载对应路由
		await require(router + pathArr[0])[pathArr[1] || 'init'](ctx);
	});
	//监听错误
	app.on('error', async (err, ctx) => {
		//记录日记信息
		console.error('app.js 异常捕获:\r\n', `请求url: ${ctx.originalUrl}\r\n`, err);
	});
}


/***********************
		工具函数区
************************/
/**
 * 初始化缓存
 */
function initCache({
	storage
}) {
	//初始化
	storage.setProperty('scripts', []);
	//更改标记
	isFirstEnter = false;
}