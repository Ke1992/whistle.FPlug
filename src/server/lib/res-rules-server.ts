// 自己的库
import RuleTool from '../shared/tools/RuleTool';
// 定义
import {
    WhistleServer,
    WhistleOptions,
} from '../shared/interface';

export default function (server: WhistleServer, options: WhistleOptions): void {
    // 监听request请求
    server.on('request', (req, res) => {
        const {
            ruleValue, // 配置的规则
        } = req.originalReq;

        // 插件未启用 || 不是默认规则，则直接返回
        if (options.storage.getProperty('plug') !== 'on' || ruleValue !== 'none') {
            res.end();
            return;
        }

        // 获取规则
        res.end(RuleTool.getResRules(options));
    });
}
