/**
 * 通用工具类
 */
class Tool {
	//格式化时间戳
	static formatDate(date) {
		const time = new Date(date);

		//年
		const year = time.getFullYear();
		//月
		const month = ('0' + (time.getMonth() + 1)).slice(-2);
		//日
		const day = ('0' + time.getDate()).slice(-2);
		//小时
		const hour = ('0' + time.getHours()).slice(-2);
		//分钟
		const minute = ('0' + time.getMinutes()).slice(-2);
		//秒
		const second = ('0' + time.getSeconds()).slice(-2);

		return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
	}
}

export default Tool;