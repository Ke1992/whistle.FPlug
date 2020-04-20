// 库
import Request from '../tools/Request';
// 定义
import {
    ResponseData,
    WebSocketItem,
} from '../interface';

/**
 * websocket数据请求类
 */
export default class WebScoketModel {
    /**
     * 获取所有配置
     */
    public static async list(): Promise<ResponseData> {
        // 发起请求
        return Request.get('/plugin.fplug/websocket/list')
            .then((result): ResponseData => result);
    }

    /**
     * 更新配置
     */
    public static async update(list: WebSocketItem[]): Promise<ResponseData> {
        // 发起请求
        return Request.post('/plugin.fplug/websocket/update', { list })
            .then((result): ResponseData => result);
    }
}
