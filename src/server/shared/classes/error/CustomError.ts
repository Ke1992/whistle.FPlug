// 基类
import Data from '../base/Data';

/**
 * 异常数据对象
 */
export default class CustomError extends Data {
    /**
     * 构造函数
     * @param errorCode [返回码，默认返回系统错误]
     * @param message   [异常信息]
     */
    public constructor(errorCode: number = Data.SYSTEM_ERROR, message: string) {
        super(errorCode, '', message);
    }
}
