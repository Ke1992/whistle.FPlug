// 库
import * as _ from 'lodash';
import * as path from 'path';

/**
 * url工具类
 */
export default class UrlTool {
    /**
     * 从request中获取modulePath和methodName
     * @param urlPath [请求ctx中的path属性]
     */
    public static getModuleAndMethod(urlPath: string): {
        // 方法名称 (只读)
        readonly methodName: string;
        // 模块路径 (只读)
        readonly modulePath: string;
    } {
        const pathArr = urlPath.split('/').slice(1);

        // 补全路径
        if (pathArr.length === 0) {
            pathArr.push('index');
        } else if (pathArr.length === 1) {
            pathArr.push('init');
        }

        return {
            methodName: pathArr.slice(-1).toString(),
            modulePath: `${path.join(__dirname, '../../router', pathArr.slice(0, -1).join('/'))}`,
        };
    }

    /**
     * 格式化请求URL
     * @param source [待格式化的原始链接]
     * @param data   [待请求的参数]
     */
    public static formatUrl(source: string, data: object = {}): {
        host: string;
        path: string;
    } {
        // 创建URL对象
        const result = new URL(source);

        // 将请求数据添加到url中
        _.forEach(data, (value, key): void => {
            result.searchParams.set(key, value);
        });

        return {
            host: result.host,
            path: result.toString(),
        };
    }
}
