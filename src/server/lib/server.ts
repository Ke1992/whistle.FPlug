// 库
import * as _ from 'lodash';
// 自己的库
import ServerTool from '../shared/tools/ServerTool';
// 定义
import {
    WhistleServer,
    WhistleOptions,
} from '../shared/interface';
// 常量
const DOCTYPE_CONTENT = '<!DOCTYPE html>';
// TODO: 后续需要替换成本地文件
// vconsole注入
const VCONSOLE_CONTENT = `
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/vConsole/3.3.0/vconsole.min.js"></script>
    <script type="text/javascript">
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
// JS注入--响应端脚本
const INVADE_RESPONSE = 'try{{content}}catch(e){};document.body && document.body.removeChild(document.getElementById("{id}"));';

export default function (server: WhistleServer, options: WhistleOptions): void {
    // 监听request请求
    server.on('request', async (req, res) => {
        const {
            config,
            storage,
        } = options;

        // 插件未启用，则直接pass
        if (storage.getProperty('plug') !== 'on') {
            req.passThrough();
            return;
        }

        const {
            headers: {
                accept,
            },
            originalReq: {
                url, // 请求的url
                ruleValue, // 配置的规则
            },
        } = req;
        const isUseInvade = storage.getProperty('invade') === 'on';
        const isUseConsole = storage.getProperty('console') === 'on';
        const isUseVconsole = storage.getProperty('vconsole') === 'on';

        // 日否是回传回来的console日志
        if (ruleValue === 'log') {
            const param = new URL(url).searchParams;
            const {
                data,
                message,
                errorCode,
            } = await ServerTool.sendLogToUI(req, param, config.port);
            // 返回结果
            res.end(errorCode === 0 ? data : message);
            return;
        }

        // 是否是JS注入的回包
        if (url.includes('//www.example.com/?_t=') || url.includes('//www.example.com?_t=')) {
            const content = INVADE_RESPONSE
                .replace('{content}', ServerTool.getInvadeFromCache(options))
                .replace('{id}', new URL(url).searchParams.get('id'));

            // 直接返回
            res.end(content);
            return;
        }

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
    });
}
