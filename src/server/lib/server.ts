// 自己的库
import ServerTool from '../shared/tools/ServerTool';
import WebSocketTool from '../shared/tools/WebSocketTool';
// 定义
import {
    WhistleServer,
    WhistleOptions,
} from '../shared/interface';
// 常量
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
            originalReq: {
                url, // 请求的url
                ruleValue, // 配置的规则
            },
        } = req;

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

        // 普通的文件映射
        if (ruleValue !== 'none') {
            await ServerTool.handleServerFileMapping(req, res);
            return;
        }

        // 处理html注入相关逻辑
        await ServerTool.handleServerHtmlInvade(options, req, res);
    });

    // 监听websocket请求
    // 实现思路参考: https://github.com/whistle-plugins/whistle.custom-ws
    WebSocketTool.handleWebSockeListening(server, options);
}
