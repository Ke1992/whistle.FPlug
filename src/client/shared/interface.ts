// 后台接口返回的响应数据
export interface ResponseData {
    // 返回的消息
    message: string;

    // 返回码
    errorCode: number;

    // 返回的具体数据
    data: object | string | number | boolean | object[] | string[] | number[];
}

// 状态结果
export interface StatusData {
    [propName: string]: string;
}

// 校验结果
export interface ValidResult {
    valid: boolean;
    message: string;
}

// 切换选项结果
export interface CheckOptions {
    text: string;
    value: string;
}

// 日志单条对象
export interface LogItem {
    type: string;
    serial: string;
    nowurl: string;
    content: string;
}

// websocket单条配置对象
export interface WebSocketItem {
    key: string;
    rule: string;
    file: string;
    type: 'Server' | 'Client';
}

// websocket配置弹框参数
export interface DialogParam {
    key?: string;
    rule?: string;
    file?: string;
    confirmFunc: Function;
    type?: 'Server' | 'Client';
}
