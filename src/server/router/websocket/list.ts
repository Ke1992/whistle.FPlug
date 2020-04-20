// 库
import {
    Context,
} from 'koa';
// 自己的库
import Data from '../../shared/classes/base/Data';

/**
 * 获取所有配置
 * @param ctx [koa的Context对象]
 */
export default async function list(ctx: Context): Promise<Data> {
    let result = [];
    try {
        result = ctx.storage.getProperty('websocket') || [];
    } catch (error) {
        // do nothing
    }
    // 返回结果
    return new Data(0, result, '获取成功');
}
