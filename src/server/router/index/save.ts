// 库
import {
    Context,
} from 'koa';
import * as _ from 'lodash';
// 自己的库
import Data from '../../shared/classes/base/Data';
import ParamError from '../../shared/classes/error/ParamError';

/**
 * 获取状态接口
 * @param ctx [koa的Context对象]
 */
export default async function save(ctx: Context): Promise<Data> {
    // 获取相关数据
    const {
        script,
    } = ctx.request.body;
    const scripts = ctx.storage.getProperty('scripts') || [];

    // 参数错误
    if (_.isEmpty(script)) {
        return new ParamError();
    }

    // 塞入数组
    scripts.push(script);
    try {
        // 储存配置数据
        ctx.storage.setProperty('scripts', scripts);
        // 返回结果
        return new Data(0, script, '发送成功');
    } catch (error) {
        // 存储异常
        return new Data(2, '发送失败', error.stack || error.toString());
    }
}
