/**
 * 返回包对象基类
 */
export default class Data {
    // 返回的消息
    public message: string;

    // 返回码
    public errorCode: number;

    // 返回的具体数据
    public data: object | string | number | boolean | object[] | string[] | number[];

    /**
     * 构造函数
     * @param errorCode [返回码]
     * @param data      [数据]
     * @param message   [异常信息]
     */
    public constructor(
        errorCode: number,
        data: object | string | number | boolean | object[] | string[] | number[],
        message: string,
    ) {
        this.data = data;
        this.message = message;
        this.errorCode = errorCode;
    }

    // 参数错误
    public static PARAM_ERROR = 1;

    // 系统异常
    public static SYSTEM_ERROR = -1;

    // 本地http请求异常
    public static LOCAL_HTTP_ERROR = -2;
}
