// 库
import React, {
    Component,
    ReactNode,
} from 'react';
import ReactDOM from 'react-dom';
// 组件
import {
    Subnav,
    Container,
} from '../components/common';
import {
    Tool,
    Invade,
} from '../components/index';
// 请求类
import IndexModel from '../shared/apis/IndexModel';
// 定义
import {
    StatusData,
} from '../shared/interface';
// 样式
require('./index.scss');
// 定义
type IndexState = StatusData;

/**
 * Index页面
 */
class Index extends Component<{}, IndexState> {
    public constructor(props: {}) {
        super(props);

        this.state = {
            cache: 'off',
            invade: 'off',
            console: 'off',
            vconsole: 'off',
        };

        // 绑定函数
        this.getToolStatus = this.getToolStatus.bind(this);

        this.handleSwitchEvent = this.handleSwitchEvent.bind(this);

        // 先获取一下插件状态
        this.getToolStatus();
    }

    public render(): ReactNode {
        return (
            <Container>
                <Subnav title="工具库" />
                <div className="spacing"></div>
                <Tool
                    status={ this.state }
                    handleSwitchEvent={ this.handleSwitchEvent }
                />
                <Invade
                    status={ this.state }
                    handleSwitchEvent={ this.handleSwitchEvent }
                />
            </Container>
        );
    }

    /**
     * 获取插件状态
     */
    private getToolStatus(): void {
        // 获取列表数据
        IndexModel.status().then(({ errorCode, data }): void => {
            // 异常直接返回
            if (errorCode !== 0) {
                return;
            }
            // 更新状态
            this.setState({
                ...(data as StatusData),
            });
        });
    }

    // --------------------事件处理函数--------------------
    /**
     * 插件启用切换事件
     */
    private handleSwitchEvent(key: string): void {
        // 获取列表数据
        IndexModel.change(key, this.state[key]).then(({ errorCode, data, message }): void => {
            // 异常直接返回
            if (errorCode !== 0) {
                alert(message);
                return;
            }
            // 更新状态
            this.setState({
                [key]: data as string,
            });
        });
    }
}

// 渲染页面
ReactDOM.render(
    <Index></Index>,
    document.getElementById('app'),
);
