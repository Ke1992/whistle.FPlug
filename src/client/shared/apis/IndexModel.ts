// 库
import Request from '../tools/Request';
// 定义
import {
    ResponseData,
} from '../interface';

/**
 * index数据请求类
 */
export default class IndexModel {
    /**
     * 获取状态
     */
    public static async status(): Promise<ResponseData> {
        // 发起请求
        return Request.get('/plugin.fplug/index/status')
            .then((result): ResponseData => result);
    }

    /**
     * 切换状态
     */
    public static async change(type: string, status: string): Promise<ResponseData> {
        // 发起请求
        return Request.get('/plugin.fplug/index/change', { type, status })
            .then((result): ResponseData => result);
    }

    /**
     * 发送JS脚本
     */
    public static async save(script: string): Promise<ResponseData> {
        // 发起请求
        return Request.post('/plugin.fplug/index/save', { script })
            .then((result): ResponseData => result);
    }

    /**
     * 获取所有console日志
     */
    public static async list(): Promise<ResponseData> {
        // 发起请求
        return Request.get('/plugin.fplug/index/list')
            .then((result): ResponseData => result);
    }

    /**
     * 清除所有console日志
     */
    public static async clear(): Promise<ResponseData> {
        // 发起请求
        return Request.get('/plugin.fplug/index/clear')
            .then((result): ResponseData => result);
    }
}
