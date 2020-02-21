// 库
import * as _ from 'lodash';
import * as http from 'http';
// 自己的库
import UrlTool from './UrlTool';
import Data from '../classes/base/Data';
import CustomError from '../classes/error/CustomError';
// 定义
interface RequestParam {
    url: string;
    port: number;
    data: object;
}

/**
 * request请求工具类
 */
export default class RequestTool {
    /**
     * 发起本地的get请求
     * @param param [请求的必要参数]
     */
    public static async get(param: RequestParam): Promise<Data> {
        // 获取请求必要的参数
        const {
            options,
        } = RequestTool.formatOptions('get', param);
        // 发起请求
        return RequestTool.request(options);
    }

    /**
     * 发起本地的post请求
     * @param param [请求的必要参数]
     */
    public static async post(param: RequestParam): Promise<Data> {
        // 获取请求必要的参数
        const {
            options,
            postData,
        } = RequestTool.formatOptions('post', param);
        // 发起请求
        return RequestTool.request(options, postData);
    }

    /**
     * 底层请求函数
     * @param options [请求所需要的参数]
     */
    private static async request(
        options: http.RequestOptions,
        postData: string = null,
    ): Promise<Data> {
        // 返回结果
        return new Promise((resolve): void => {
            // 构造请求
            const req = http.request(options, (res): void => {
                let content = '';

                res.setEncoding('utf8');
                res.on('data', (chunk): void => {
                    content += chunk.toString();
                });

                res.on('end', (): void => {
                    // 判断接口状态码
                    if (res.statusCode === 200) {
                        resolve(JSON.parse(content));
                        return;
                    }
                    // 抛出错误
                    resolve(new CustomError(CustomError.LOCAL_HTTP_ERROR, '本地http请求返回状态码非200'));
                });
            });

            // 监听异常
            req.on('error', (error): void => {
                // 抛出错误
                resolve(new CustomError(CustomError.LOCAL_HTTP_ERROR, error.message));
            });

            // POST请求需要写数据
            !_.isNull(postData) && req.write(postData);

            // 发起请求
            req.end();
        });
    }

    /**
     * 格式化请求链接
     * @param method [get/post]
     * @param param  [请求的必要参数]
     */
    private static formatOptions(method: string, param: RequestParam): {
        postData: string;
        options: http.RequestOptions;
    } {
        const {
            url,
            port,
            data,
        } = param;
        const headers: http.OutgoingHttpHeaders = {};

        // 如果是post请求需要特殊处理
        if (method === 'post') {
            // 设置额外的头部信息
            headers['Content-Type'] = 'application/json';
        }

        return {
            options: {
                port,
                method,
                headers,
                ...UrlTool.formatUrl(url, method === 'post' ? {} : data),
            },
            postData: JSON.stringify(data),
        };
    }
}
