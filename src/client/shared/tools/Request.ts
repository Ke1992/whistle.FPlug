// 库
import _ from 'lodash';
// 定义
import {
    ResponseData,
} from '../interface';

/**
 * 请求辅助类
 */
export default class Request {
    /**
     * Get请求方法
     * @param url  [请求的链接]
     * @param data [请求的参数]
     */
    public static async get(url: string, data: object = {}): Promise<ResponseData> {
        return Request.request(Request.formatRequestUrl(url, data));
    }

    /**
     * Post请求方法
     * @param url  [请求的链接]
     * @param data [请求的参数]
     */
    public static async post(url: string, data: object = {}): Promise<ResponseData> {
        return Request.request(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // --------------------私有函数--------------------
    /**
     * 格式化请求链接
     * @param url  [请求的链接]
     * @param data [请求的参数]
     */
    private static formatRequestUrl(url: string, data: object): string {
        const result = new URL(window.location.protocol + window.location.host + url);

        // 遍历添加参数
        _.forEach(data, (value, key): void => {
            result.searchParams.set(key, value);
        });

        return result.toString();
    }

    /**
     * 底层请求函数
     */
    private static async request(url: string, param: object = {}): Promise<ResponseData> {
        return window.fetch(url, {
            ...param,
            credentials: 'include',
        }).then((response): Promise<ResponseData> => {
            const result = response.json();
            return result;
        }).then((result): ResponseData => result).catch((error): ResponseData => {
            const errorCode = -1000;
            const message = error.stack || error.toString();
            // 返回降级数据
            return {
                data: {},
                message,
                errorCode,
            };
        });
    }
}
