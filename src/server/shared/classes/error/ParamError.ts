// 基类
import Data from '../base/Data';

/**
 * 异常数据对象
 */
export default class ParamError extends Data {
    /**
     * 构造函数
     */
    public constructor(message = '参数错误') {
        super(Data.PARAM_ERROR, '', message);
    }
}
