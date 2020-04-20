// 库
import {
    Context,
} from 'koa';
// 自己的库
import Data from '../../shared/classes/base/Data';

/**
 * 更新配置
 * @param ctx [koa的Context对象]
 */
export default async function update(ctx: Context): Promise<Data> {
    try {
        // 储存配置数据
        ctx.storage.setProperty('websocket', ctx.request.body.list || []);
        // 返回结果
        return new Data(0, '', '更新成功');
    } catch (error) {
        // 存储异常
        return new Data(2, '', error.stack || error.toString());
    }
}
