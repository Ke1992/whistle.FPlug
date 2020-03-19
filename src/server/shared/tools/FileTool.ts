// 库
import * as fs from 'fs';

/**
 * 文件操作工具类
 */
export default class FileTool {
    /**
     * 封装fs.readFile成Promise
     * @param filePath [文件路径]
     */
    public static readFileAsync(filePath: string): Promise<string> {
        return new Promise((resolve) => {
            fs.readFile(filePath, 'utf8', (error, data) => {
                // 异常直接抛出
                if (error) {
                    throw error;
                }
                // 正常返回
                resolve(data.toString());
            });
        });
    }
}
