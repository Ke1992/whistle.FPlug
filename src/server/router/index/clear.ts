// 库
import {
    Context,
} from 'koa';
// 自己的库
import LogTool from '../../shared/tools/LogTool';
import Data from '../../shared/classes/base/Data';

/**
 * 清除所有console日志
 * @param ctx [koa的Context对象]
 */
export default async function clear(ctx: Context): Promise<Data> {
    // 清除日志
    LogTool.clear();
    // 返回结果
    return new Data(0, [], '清除成功');
}
