export default {
	rule: {
		no: 'no', //不进行校验
		http: 'http', //必须是http请求
		empty: 'empty', //不为空
		email: 'email', //邮箱
		custom: 'custom', //自定义
		number: 'number', //只能是数字
		english: 'english', //只能是英文字母
		character: 'character' //只能是汉字
	},
	func: {
		no: () => {
			return {
				valid: true,
				msg: '校验成功'
			}
		},
		http: (value) => {
			return getResultByRegExp(value, '^http:\/\/', '必须是http请求');
		},
		empty: (value) => {
			return {
				valid: !!value,
				msg: '不能为空'
			}
		},
		email: (value) => {
			return getResultByRegExp(value, '^[\\w-]+(\\.[\\w-]+)*@[\\w-]+(\\.[\\w-]+)+$', '未通过邮箱格式校验');
		},
		number: (value) => {
			return getResultByRegExp(value, '^[0-9]*$', '只能是数字');
		},
		english: (value) => {
			return getResultByRegExp(value, '^[A-Za-z]+$', '只能只能是英文字母是汉字');
		},
		character: (value) => {
			return getResultByRegExp(value, '^[\u4e00-\u9fa5]*$', '只能是汉字');
		},
		//自定义
		custom: (value, regexp) => {
			return getResultByRegExp(value, regexp, '格式错误');
		}
	}
}

/**
 * 根据正则表达式获取结果
 */
function getResultByRegExp(value, regexp, msg) {
	const reg = new RegExp(regexp);

	return {
		valid: !!(value && reg.test(value)),
		msg
	}
}