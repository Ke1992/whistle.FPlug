// 自己的库
import Data from '../classes/base/Data';
import RequestTool from './RequestTool';
// 定义
import {
    WhistleRequest,
    WhistleOptions,
} from '../interface';

/**
 * rule工具类
 */
export default class ServerTool {
    /**
     * 将日志发送到UI对应的Server
     * @param req   [whistle提供的Request对象]
     * @param param [url中携带的参数]
     */
    public static async sendLogToUI(
        req: WhistleRequest, param: URLSearchParams, port: number,
    ): Promise<Data> {
        const content = await ServerTool.getPostData(req);
        // 将log发送到UI侧
        return RequestTool.post({
            port,
            data: {
                content,
                type: param.get('type'),
                serial: param.get('serial'),
                nowurl: decodeURIComponent(param.get('nowurl')),
            },
            url: 'http://127.0.0.1/plugin.fplug/index/log',
        });
    }

    /**
     * 从缓存中获取JS注入的脚本
     * @param options [whistle提供的Options对象]
     */
    public static getInvadeFromCache(options: WhistleOptions): string {
        const {
            storage,
        } = options;
        const scripts = storage.getProperty('scripts');
        const result = scripts.shift() || '';

        // 重新写入缓存
        storage.setProperty('scripts', scripts);

        return result;
    }

    // --------------------私有函数--------------------
    /**
     * 获取post数据
     * @param req [whistle提供的Request对象]
     */
    private static async getPostData(req: WhistleRequest): Promise<string> {
        return new Promise<string>((resolve) => {
            // 如果空数组直接返回
            if (req.headers['content-length'] === '0') {
                resolve('');
                return;
            }
            // 获取数据
            let result: Buffer = null;
            req.on('data', (data) => {
                result = result ? Buffer.concat([result, data]) : data;
            });
            req.on('end', () => {
                resolve(result.toString());
            });
            // 监听异常
            req.on('error', () => {
                resolve('');
            });
        }).catch(() => '');
    }
}
