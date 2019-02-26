export default {
    menu: {
        data: [{
            title: '工具',
            minTitle: '工具',
            url: '/plugin.fplug/index/init',
            icon: 'icon-grid'
        }, {
            title: '日志',
            minTitle: '日志',
            url: '/plugin.fplug/index/invade',
            icon: 'icon-paper'
        }]
    },
    tool: {
        data: [{
            key: 'cache',
            title: '禁止缓存',
            icon: 'icon-spinner9',
            type: ''
        }, {
            key: 'vconsole',
            title: 'vConsole注入',
            icon: 'icon-cogs',
            type: ''
        }, {
            key: 'console',
            title: 'console日志',
            icon: 'icon-bug',
            type: ''
        }]
    },
    footer: {
        data: [{
            name: '帮助文档',
            url: 'https://github.com/Ke1992/whistle.FPlug.git'
        }, {
            name: 'Fiddler-FPlug',
            url: 'https://github.com/Ke1992/Fiddler-FPlug.git'
        }]
    }
}