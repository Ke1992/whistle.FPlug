//全局变量
const VCONSOLE = `
	<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/vConsole/3.3.0/vconsole.min.js"></script>
	<script type="text/javascript">
		VConsole && new VConsole();
	</script>`;
//console日志
const CONSOLE = `
	<script type="text/javascript">
		//console日志打印脚本
		//实现的太简单、后续参考一下vconsole的实现
		(function () {
			window.consoleTotalNum = 0;
			//log方法
			window.console.logOld = window.console.log;
			window.console.log = function () {
				//序号增加
				window.consoleTotalNum++;
				//调用原始的方法
				window.console.logOld.apply(this, arguments);
				//发送请求
				sendLogToFiddler('log', arguments);
			};
			//error方法
			window.console.errorOld = window.console.error;
			window.console.error = function () {
				//序号增加
				window.consoleTotalNum++;
				//调用原始的方法
				window.console.errorOld.apply(this, arguments);
				//发送请求
				sendLogToFiddler('error', arguments);
			};
			//warn方法
			window.console.warnOld = window.console.warn;
			window.console.warn = function () {
				//序号增加
				window.consoleTotalNum++;
				//调用原始的方法
				window.console.warnOld.apply(this, arguments);
				//发送请求
				sendLogToFiddler('warn', arguments);
			};
			function sendLogToFiddler(type, param) {
				if (!param.length) {
					return false;
				}
				var data = '',
					xhr = new XMLHttpRequest(),
					url = location.protocol + '//www.example.com',
					nowurl = encodeURIComponent(location.protocol + '//' + location.host + location.pathname);
				//遍历拼接数据
				for (var i = 0, len = param.length; i < len; i++) {
					if (param[i] && Object.prototype.toString.call(param[i]) == '[object Object]') {
						data += JSON.stringify(param[i]) + '   ';
					} else if (param[i]) {
						data += param[i].toString() + '   ';
					}
				}
				//发送请求
				xhr.open('POST', url + '?serial=' + window.consoleTotalNum + '&type='+ type +'&nowurl=' + nowurl, true);
				xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				xhr.send(data.trim());
			}
		}());
	</script>`;
//JS注入--请求端脚本
const INVADE_REQUEST = `
	<script type="text/javascript">
		(function () {
			var total = 1; //计数器
			//循环发送请求
			setInterval(function () {
				//新建标签
				var FPlugScript = document.createElement('script');
				//设置各种参数
				FPlugScript.id = 'FPlug_script_' + (total++);
				FPlugScript.src = location.protocol + '//www.example.com?_t=' + new Date().getTime() + '&id=' + FPlugScript.id;
				//将node节点添加到页面中去
				document.body && document.body.appendChild(FPlugScript);
			}, 2000);
		})();
	</script>`;
//JS注入--响应端脚本
const INVADE_RESPONSE = 'try{{content}}catch(e){};document.body && document.body.removeChild(document.getElementById("{id}"));';
//禁止缓存参数
const RES_NO_CACHE_HEADER = {
	'Expires': -1,
	'Pragma': 'no-cache',
	'Cache-Control': 'no-cache'
};

module.exports = function(server, options) {
	//监听request请求
	server.on('request', (req, res) => {
		const ruleValue = req.originalReq.ruleValue; //配置规则状态
		const plug = options.storage.getProperty('plug'); //获取整个插件开关状态

		//不等于on && 规则不是默认值
		if (plug !== 'on' || ruleValue !== 'none') {
			//直接返回,不使用任何规则
			return res.end();
		}

		res.end(getAllResRules(req, res, options));
	});
};

/**
 * 获取所有规则
 */
function getAllResRules(req, res, options) {
	let result = '';
	const rules = [];
	const values = {};
	const url = req.originalReq.url; //原始链接
	const contentType = req.headers['content-type']; //页面类型
	const {
		storage //插件储存数据对象
	} = options;

	//是否禁止缓存
	if (storage.getProperty('cache') == 'on') {
		rules.push('/./ resHeaders://${nocache}');
		values.nocache = JSON.stringify(RES_NO_CACHE_HEADER);
	}

	//是否是js注入的回包
	if (url.indexOf('//www.example.com/?_t=') >= 0 || url.indexOf('//www.example.com?_t=') >= 0) {
		rules.push('/./ resBody://{invade}');
		values.invade = INVADE_RESPONSE
			.replace('{content}', getInvadeFromCache(storage))
			.replace('{id}', new URL(url).searchParams.get('id'));
	} else {
		//是否是html页面
		if (contentType && contentType.split(';')[0] === 'text/html') {
			//vConsole
			if (storage.getProperty('vconsole') == 'on') {
				result += VCONSOLE;
			}
			//console日志
			if (storage.getProperty('console') == 'on') {
				result += CONSOLE;
			}
			//js注入
			if (storage.getProperty('invade') == 'on') {
				result += INVADE_REQUEST;
			}
		}

		//如果有需要替换的内容
		if (result) {
			rules.push('/./ resReplace://${result}');
			values.result = JSON.stringify({
				'<html>': `${result}<html>`,
				'<html ': `${result}<html `
			});
		}
	}

	return JSON.stringify({
		rules: rules.join('\n'),
		values
	});
}


/***********************
		工具函数区
************************/
/**
 * 从缓存中获取注入脚本
 */
function getInvadeFromCache(storage) {
	const scripts = storage.getProperty('scripts');
	const result = scripts.shift() || '';

	//重新写入缓存
	storage.setProperty('scripts', scripts);

	return result;
}