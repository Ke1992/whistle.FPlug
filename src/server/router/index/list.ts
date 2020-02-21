// 库
import {
    Context,
} from 'koa';
// 自己的库
import LogTool from '../../shared/tools/LogTool';
import Data from '../../shared/classes/base/Data';

/**
 * 获取所有console日志
 * @param ctx [koa的Context对象]
 */
export default async function list(ctx: Context): Promise<Data> {
    // 返回结果
    return new Data(0, LogTool.list(), '获取成功');
}
