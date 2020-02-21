// 定义
import {
    LogItem,
} from '../interface';
// 全局常量
let logs: LogItem[] = [];

/**
 * 日志工具类
 */
export default class LogTool {
    /**
     * 添加日志
     */
    public static add(log: LogItem): void {
        logs.push(log);
    }

    /**
     * 获取所有日志
     */
    public static list(): LogItem[] {
        return logs;
    }

    /**
     * 清除所有日志
     */
    public static clear(): void {
        logs = [];
    }
}
