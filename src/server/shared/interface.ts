// 库
import * as http from 'http';

import WebSocket = require('ws');

// whistle提供的Websocket对象
export type WhistleWebSocket = WebSocket;

// whistle提供的Request对象
export interface WhistleRequest extends http.IncomingMessage {
    originalReq: {
        url: string;
        ruleValue: string;
        headers: {
            [key: string]: string;
        };
    };
    curSendState: string;
    passThrough: Function;
    curReceiveState: string;
    wsReceiveClient: WhistleWebSocket;
    request(callback: (res: http.IncomingMessage) => void): http.ClientRequest;
}

// 导出node的ServerResponse定义
export type WhistleResponse = http.ServerResponse;

// whistle提供的server对象
export type WhistleServer = http.Server;

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

// websocket单条配置对象
export interface WebSocketItem {
    rule: string;
    file: string;
    type: 'Server' | 'Client';
}
