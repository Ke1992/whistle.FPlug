// 定义
import {
    WhistleValues,
    WhistleOptions,
} from '../interface';
// 常量
const NO_CACHE_REQ = {
    Expires: -1,
    Pragma: 'no-cache',
    'If-None-Match': 'no',
    'If-Modified-Since': 'no',
    'Cache-Control': 'no-cache',
};
const NO_CACHE_RES = {
    Expires: -1,
    Pragma: 'no-cache',
    'Cache-Control': 'no-cache',
};

/**
 * rule工具类
 */
export default class RuleTool {
    /**
     * 获取Request侧的whistle规则
     * @param options [whistle提供的Options对象]
     */
    public static getReqRules(options: WhistleOptions): string {
        const rules: string[] = [];
        const values: WhistleValues = {};
        const {
            storage,
        } = options;

        // 是否禁止缓存
        if (storage.getProperty('cache') === 'on') {
            rules.push('/./ reqHeaders://${nocache}'); // eslint-disable-line
            values.nocache = JSON.stringify(NO_CACHE_REQ);
        }

        return JSON.stringify({
            rules: rules.join('\n'),
            values,
        });
    }

    /**
     * 获取Response侧的whistle规则
     * @param options [whistle提供的Options对象]
     */
    public static getResRules(options: WhistleOptions): string {
        const rules: string[] = [];
        const values: WhistleValues = {};
        const {
            storage,
        } = options;

        // 是否禁止缓存
        if (storage.getProperty('cache') === 'on') {
            rules.push('/./ resHeaders://${nocache}'); // eslint-disable-line
            values.nocache = JSON.stringify(NO_CACHE_RES);
        }

        return JSON.stringify({
            rules: rules.join('\n'),
            values,
        });
    }
}
