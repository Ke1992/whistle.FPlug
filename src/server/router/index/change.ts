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
export default async function change(ctx: Context): Promise<Data> {
    const {
        type,
        status,
    } = ctx.request.query;

    // 参数为空
    if (_.isEmpty(type) || _.isEmpty(status)) {
        return new ParamError();
    }
    // 参数异常
    if (status !== 'on' && status !== 'off') {
        return new ParamError();
    }

    // 获取存储的最终结果
    const data = status === 'on' ? 'off' : 'on';
    // 切换工具状态
    try {
        // 储存配置数据
        ctx.storage.setProperty(type, data);
        // 返回结果
        return new Data(0, data, '切换成功');
    } catch (error) {
        return new Data(2, '切换失败', error.stack || error.toString());
    }
}
