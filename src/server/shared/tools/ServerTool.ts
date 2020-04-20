// 库
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';
// 自己的库
import FileTool from './FileTool';
import RequestTool from './RequestTool';
import Data from '../classes/base/Data';
// 定义
import {
    WhistleRequest,
    WhistleOptions,
    WhistleResponse,
} from '../interface';
// 常量
const DOCTYPE_CONTENT = '<!DOCTYPE html>';
const VCONSOLE_FILE_PATH = path.join(__dirname, '../vconsole.min.js');
// vconsole注入
const VCONSOLE_CONTENT = `
    <script type="text/javascript">
${fs.readFileSync(VCONSOLE_FILE_PATH)}
VConsole && new VConsole();
    </script>`;
// console日志
const CONSOLE_CONTENT = `
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
                sendLogToWhistle('log', arguments);
            };
            //error方法
            window.console.errorOld = window.console.error;
            window.console.error = function () {
                //序号增加
                window.consoleTotalNum++;
                //调用原始的方法
                window.console.errorOld.apply(this, arguments);
                //发送请求
                sendLogToWhistle('error', arguments);
            };
            //warn方法
            window.console.warnOld = window.console.warn;
            window.console.warn = function () {
                //序号增加
                window.consoleTotalNum++;
                //调用原始的方法
                window.console.warnOld.apply(this, arguments);
                //发送请求
                sendLogToWhistle('warn', arguments);
            };
            function sendLogToWhistle(type, param) {
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
// JS注入--请求端脚本
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

/**
 * Server工具类
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

    /**
     * 处理文件映射相关逻辑
     * @param req [whistle提供的Request对象]
     * @param res [node的ServerResponse对象]
     */
    public static async handleServerFileMapping(
        req: WhistleRequest, res: WhistleResponse,
    ): Promise<void> {
        const {
            originalReq: {
                url, // 请求的url
                ruleValue, // 配置的规则
            },
        } = req;

        // 获取url参数
        const param = new URL(url).searchParams;
        const callback = param.get('callback') || param.get('cb');

        try {
            // 获取文件内容（同时移除前后空格）
            let content = (await FileTool.readFileAsync(ruleValue)).trim();
            // callback参数不为空
            if (!_.isEmpty(callback)) {
                // 严格校验
                if (content[0] === '{' && content.slice(-1) === '}') {
                    content = `${callback}(${content})`;
                } else {
                    // 进行callback字符串替换
                    content = content.replace('callback', callback);
                }
            }
            // 修改状态码
            res.statusCode = 200;
            // 返回本地的文本内容
            res.end(content);
        } catch (e) {
            // 进行容错处理，直接转发
            req.passThrough();
        }
    }

    /**
     * 处理html注入相关逻辑
     * @param options [whistle提供的Options对象]
     * @param req     [whistle提供的Request对象]
     * @param res     [node的ServerResponse对象]
     */
    public static async handleServerHtmlInvade(
        options: WhistleOptions, req: WhistleRequest, res: WhistleResponse,
    ): Promise<void> {
        const {
            storage,
        } = options;
        const {
            headers: {
                accept,
            },
        } = req;

        const isUseInvade = storage.getProperty('invade') === 'on';
        const isUseConsole = storage.getProperty('console') === 'on';
        const isUseVconsole = storage.getProperty('vconsole') === 'on';

        // 如果全部工具都没有启用，则直接pass
        if (!isUseInvade && !isUseConsole && !isUseVconsole) {
            req.passThrough();
            return;
        }
        // 没有accept || accept不合法，则直接pass
        if (_.isEmpty(accept) || !accept.includes('text/html')) {
            req.passThrough();
            return;
        }

        // 转发获取数据
        delete req.headers['accept-encoding'];
        const client = req.request((response) => {
            // 如果状态码非200，则直接转发
            if (response.statusCode !== 200) {
                // 更新状态码
                res.statusCode = response.statusCode;
                response.pipe(res);
                return;
            }

            // 如果content-type非法则直接转发
            const contentType = response.headers['content-type'];
            if (contentType && contentType.split(';')[0] !== 'text/html') {
                response.pipe(res);
                return;
            }

            // 由于内容长度可能有变，删除长度自动改成 chunked
            delete response.headers['content-length'];
            // 获取文本数据
            let content: Buffer = null;
            response.on('data', (data) => {
                content = content ? Buffer.concat([content, data]) : data;
            });
            response.on('end', () => {
                const data = content.toString();

                // 如果文本内容合法，才进行替换
                if (data.includes('<html>') || data.includes('<html ')) {
                    // 如果启用了vconsole
                    if (isUseVconsole) {
                        content = Buffer.concat([Buffer.from(VCONSOLE_CONTENT), content]);
                    }
                    // console日志
                    if (isUseConsole) {
                        content = Buffer.concat([Buffer.from(CONSOLE_CONTENT), content]);
                    }
                    // 如果启用了JS注入
                    if (isUseInvade) {
                        content = Buffer.concat([Buffer.from(INVADE_REQUEST), content]);
                    }
                    // 写入<!DOCTYPE html>，防止部分页面出现样式异常
                    content = Buffer.concat([Buffer.from(DOCTYPE_CONTENT), content]);
                }

                res.end(content);
            });
        });
        req.pipe(client);
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
