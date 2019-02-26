/**
 * Url的工具类
 */
class Url {
	//格式化url
	static formatUrlPath(url, param) {
		const result = new URL(window.location.protocol + window.location.hostname + url);

		for (const key in param) {
			param[key] && result.searchParams.set(key, param[key]);
		}

		return result.pathname + result.search;
	}

	//根据类型切换开关
	static switchToggleByType(type, status) {
		return window.fetch(Url.formatUrlPath('/plugin.fplug/index/switch', {
			type,
			status
		})).then(response => {
			return response.json();
		});
	}

	//发送
	static sendScriptToCache(data) {
		return window.fetch('/plugin.fplug/index/save', {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				data
			})
		}).then(response => {
			return response.json();
		});
	}

	//获取日志
	static getAllLog() {
		return window.fetch('/plugin.fplug/index/list').then(response => {
			return response.json();
		});
	}

	//清空日志
	static clearAllLog() {
		return window.fetch('/plugin.fplug/index/clear').then(response => {
			return response.json();
		});
	}
}

export default Url;