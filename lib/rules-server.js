//全局变量
const REQ_NO_CACHE_HEADER = {
	'Expires': -1,
	'Pragma': 'no-cache',
	'If-None-Match': 'no',
	'If-Modified-Since': 'no',
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

		//发送请求
		res.end(getAllReqRules(req, res, options));
	});
};

/**
 * 获取所有规则
 */
function getAllReqRules(req, res, options) {
	const rules = [];
	const values = {};
	const {
		storage //插件储存数据对象
	} = options;

	//是否禁止缓存
	if (storage.getProperty('cache') == 'on') {
		rules.push('/./ reqHeaders://${nocache}');
		values.nocache = JSON.stringify(REQ_NO_CACHE_HEADER);
	}

	return JSON.stringify({
		rules: rules.join('\n'),
		values
	});
}