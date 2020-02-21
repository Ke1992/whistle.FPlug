// 插件库
import server from './lib/server';
import uiServer from './lib/ui-server';
import rulesServer from './lib/rules-server';
import resRulesServer from './lib/res-rules-server';

/**
 * whistle插件服务说明:
 * 1、server: 会直接把请求转发过来(这个时候没有执行过whistle本身的任何规则)
 * 2、uiServer: 插件UI服务，主要用于构建配置界面
 * 3、rulesServer: request的规则服务，用于动态添加新的规则到请求中(必须是符合whistle的规则)，使用res.end来发送新规则
 * 4、statsServer: request的统计服务，无法修改请求本身，即使不调用res.end也不影响whistle
 * 5、resRulesServer: 同rulesServer，只是是response侧
 * 6、resStatsServer: 同statsServer，只是是response侧
 */

/**
 * 想要的功能：
 * 1、禁止缓存           完成
 * 2、console输出       完成
 * 3、注入vconsole      完成
 * 4、js注入            完成
 */
export {
    server,
    uiServer,
    rulesServer,
    resRulesServer,
};
