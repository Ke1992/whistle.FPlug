// 库
import {
    Context,
} from 'koa';
import * as _ from 'lodash';
// 自己的库
import LogTool from '../../shared/tools/LogTool';
import Data from '../../shared/classes/base/Data';
import ParamError from '../../shared/classes/error/ParamError';

/**
 * 接收console日志
 * @param ctx [koa的Context对象]
 */
export default async function log(ctx: Context): Promise<Data> {
    // 获取相关数据
    const {
        type,
        serial,
        nowurl,
        content,
    } = ctx.request.body;

    // 参数错误
    if (_.isEmpty(type) || _.isEmpty(serial) || _.isEmpty(nowurl)) {
        return new ParamError();
    }

    // 塞入日志列表
    LogTool.add({
        type,
        serial,
        nowurl,
        content,
    });

    // 返回结果
    return new Data(0, `whistle fplug catch log success\n${content}`, '存储成功');
}
