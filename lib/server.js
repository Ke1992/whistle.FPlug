//库
const koa = require('koa');
const request = require('request');
//全局变量
const app = new koa();

module.exports = function(server, options) {
	//注册中间件
	initApp(options);
	//监听request请求
	server.on('request', app.callback());
};

/**
 * 注册中间件
 */
function initApp({
	config
}) {
	//异常路由
	app.use(async (ctx, next) => {
		const content = await parsePostData(ctx);
		const urlParam = new URL(ctx.req.originalReq.url).searchParams;

		//发起请求
		await postLogToUI(config, {
			content,
			type: urlParam.get('type'),
			serial: urlParam.get('serial'),
			nowurl: decodeURIComponent(urlParam.get('nowurl')),
		}).then(result => {
			ctx.body = result;
		}).catch(error => {
			ctx.body = error.stack || error.toString()
		});
	});
}


/***********************
		工具函数区
************************/
/**
 * 接收并解析post的数据
 */
function parsePostData(ctx) {
	return new Promise((resolve, reject) => {
		let result = '';

		ctx.req.addListener('data', data => {
			result += data;
		});
		ctx.req.addListener('end', () => {
			resolve(result);
		});
		ctx.req.addListener('error', data => {
			resolve('');
		});
	});
}

/**
 * 发送日志到UI的服务
 */
function postLogToUI(config, data) {
	return new Promise(resolve => {
		request({
			method: 'POST',
			url: `http://127.0.0.1:${config.port}/plugin.fplug/index/log`,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}, (error, response, body) => {
			resolve('ok');
		});
	});
}