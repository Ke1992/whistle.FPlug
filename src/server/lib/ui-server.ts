// 库
import * as Koa from 'koa';
import * as path from 'path';
import * as KoaStatic from 'koa-static';
import * as KoaBodyParser from 'koa-bodyparser';
// 自己的库
import UrlTool from '../shared/tools/UrlTool';
import CustomError from '../shared/classes/error/CustomError';
// 定义
import {
    WhistleServer,
    WhistleOptions,
} from '../shared/interface';
// 全局变量
let isFirstEnter = true;
// 全局常量
const app = new Koa();

export default function (server: WhistleServer, options: WhistleOptions): void {
    // 重置缓存
    if (isFirstEnter) {
        // 初始化
        options.storage.setProperty('scripts', []);
        // 更改标记
        isFirstEnter = false;
    }
    // 异常路由
    app.use(async (ctx, next): Promise<void> => {
        try {
            await next();
        } catch (error) {
            const {
                message,
                errorCode,
            } = error;
            // 返回异常
            ctx.body = new CustomError(errorCode, message);
            // 通知一下onerror监听者，方便错误记录
            ctx.app.emit('error', error, ctx);
        }
    });
    // 静态资源
    app.use(KoaStatic(path.join(__dirname, '../public')));
    // 解析post数据
    app.use(KoaBodyParser({
        jsonLimit: '5MB',
    }));
    // 正常的路由
    app.use(async (ctx): Promise<void> => {
        // 获取必要参数
        const {
            modulePath,
            methodName,
        } = UrlTool.getModuleAndMethod(ctx.path);
        // 设置whistle的插件数据储存对象
        ctx.storage = options.storage;
        // 加载对应的模块实例
        const moduleInstance = await import(modulePath);
        // 执行对应方法
        ctx.body = await moduleInstance[methodName](ctx);
    });
    // 异常捕获
    app.on('error', async (error: Error, ctx: Koa.Context): Promise<void> => {
        // 输出异常信息
        console.error(
            '异常捕获:\r\n',
            `url: ${ctx.href}\r\n`,
            '异常信息:\r\n',
            error,
        );
    });
    // 监听request请求
    server.on('request', app.callback());
}
