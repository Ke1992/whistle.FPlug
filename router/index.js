let logs = [];
const KEYS = ['plug', 'cache', 'invade', 'console', 'vconsole'];

//首页
exports.init = async ctx => {
	await ctx.render('index', {
		data: getCacheData(ctx)
	});
};

//日志列表页
exports.invade = async ctx => {
	const data = {
		logs: logs,
		...getCacheData(ctx)
	};

	await ctx.render('invade', {
		data
	});
};

//demo页
exports.demo = async ctx => {
	const data = {
		plug: ctx.storage.getProperty('plug') == 'on' ? 'on' : 'off'
	}

	await ctx.render('demo', {
		data: getCacheData(ctx)
	});
};


/***********************
		json接口区
************************/
//根据类型切换开关
exports.switch = async ctx => {
	const urlParam = new URL('http://localhost' + ctx.originalUrl).searchParams;
	const param = {
		type: urlParam.get('type'),
		status: urlParam.get('status')
	};

	if (param.type && param.status) {
		try {
			//储存配置数据
			ctx.storage.setProperty(param.type, param.status);
			//返回数据
			ctx.body = {
				code: 0,
				msg: '切换成功'
			};
		} catch (error) {
			//存储异常
			ctx.body = {
				code: -1,
				msg: error.stack || error.toString()
			};
		}
	} else {
		//参数错误
		ctx.body = {
			code: 1,
			msg: '参数错误'
		};
	}
};

//保存用户脚本到插件缓存中
exports.save = async ctx => {
	const param = await parsePostData(ctx);
	const scripts = ctx.storage.getProperty('scripts') || [];

	if (param.data) {
		//塞入数组
		scripts.push(param.data);
		try {
			//储存配置数据
			ctx.storage.setProperty('scripts', scripts);
			//返回数据
			ctx.body = {
				code: 0,
				msg: '切换成功'
			};
		} catch (error) {
			//存储异常
			ctx.body = {
				code: -1,
				msg: error.stack || error.toString()
			};
		}
	} else {
		//参数错误
		ctx.body = {
			code: 1,
			msg: '参数错误'
		};
	}
};

//接收日志
exports.log = async ctx => {
	const param = await parsePostData(ctx);

	//全部数据存在才塞入日志列表
	param.type && param.nowurl && param.content && param.serial && logs.push(param);

	ctx.body = {
		code: 0,
		msg: '接收成功'
	};
};

//输出日志
exports.list = async ctx => {
	//返回
	ctx.body = {
		code: 0,
		msg: '成功',
		data: logs
	};
};

//清空日志
exports.clear = async ctx => {
	//清空日志
	logs = [];
	//返回
	ctx.body = {
		code: 0,
		msg: '成功',
		data: logs
	};
};


/***********************
		工具函数区
************************/
/**
 * 接收并解析post的数据
 */
function parsePostData(ctx) {
	return new Promise((resolve, reject) => {
		let result = '';

		ctx.req.addListener('data', (data) => {
			result += data;
		});
		ctx.req.addListener('end', () => {
			try {
				result = JSON.parse(result);
				resolve(result);
			} catch (e) {
				resolve({});
			}
		});
		ctx.req.addListener('error', (data) => {
			resolve({});
		});
	});
}

/**
 * 获取插件缓存中的配置数据
 */
function getCacheData(ctx) {
	const data = {};

	KEYS.forEach(item => {
		data[item] = ctx.storage.getProperty(item) == 'on' ? 'on' : 'off';
	});

	return data;
}