// 库
import {
    Context,
} from 'koa';
// 自己的库
import Data from '../../shared/classes/base/Data';
// 定义
import {
    StatusData,
} from '../../shared/interface';

/**
 * 获取状态接口
 * @param ctx [koa的Context对象]
 */
export default async function status(ctx: Context): Promise<Data> {
    const result: StatusData = {};

    ['plug', 'cache', 'invade', 'console', 'vconsole'].forEach((item) => {
        result[item] = ctx.storage.getProperty(item) === 'on' ? 'on' : 'off';
    });

    // 返回结果
    return new Data(0, result, '查询成功');
}
