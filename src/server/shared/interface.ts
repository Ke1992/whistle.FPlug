// 库
import * as http from 'http';

// whistle提供的Request对象
export interface WhistleRequest extends http.IncomingMessage {
    originalReq: {
        url: string;
        ruleValue: string;
    };
    passThrough: Function;
    request(callback: (res: http.IncomingMessage) => void): http.ClientRequest;
}

// 导出node的ServerResponse定义
export type WhistleResponse = http.ServerResponse;

// whistle提供的server对象
export interface WhistleServer {
    on(type: string, callback: (req: WhistleRequest, res: WhistleResponse) => void): Function;
}

// whistle提供的Options对象
export interface WhistleOptions {
    storage: {
        setProperty: Function;
        getProperty: Function;
    };
    config: {
        port: number;
    };
}

// whistle插入规则对应的value对象
export interface WhistleValues {
    [propName: string]: string;
}

// 状态结果
export interface StatusData {
    [propName: string]: string;
}

// 日志单条对象
export interface LogItem {
    type: string;
    serial: string;
    nowurl: string;
    content: string;
}
