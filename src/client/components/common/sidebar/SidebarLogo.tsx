// 样式
import React, {
    Component,
    ReactNode,
} from 'react';
// 组件
import Logo from '../../../assets/images/logo.png';
import LogoOff from '../../../assets/images/logo-off.png';
// 请求类
import IndexModel from '../../../shared/apis/IndexModel';
// 定义
import {
    StatusData,
} from '../../../shared/interface';
// 样式
require('./SidebarLogo.scss');
// 定义
interface SidebarLogoState {
    status: string;
}

export default class SidebarLogo extends Component<{}, SidebarLogoState> {
    public constructor(props: {}) {
        super(props);

        this.state = {
            status: 'off',
        };

        // 绑定函数
        this.getPlugStatus = this.getPlugStatus.bind(this);

        this.handleSwitchEvent = this.handleSwitchEvent.bind(this);

        // 先获取一下插件状态
        this.getPlugStatus();
    }

    public render(): ReactNode {
        const {
            status,
        } = this.state;

        return (
            <div className='logo'>
                <img onClick={ this.handleSwitchEvent } src={ status === 'on' ? Logo : LogoOff } />
            </div>
        );
    }

    /**
     * 获取插件状态
     */
    private getPlugStatus(): void {
        // 获取列表数据
        IndexModel.status().then(({ errorCode, data }): void => {
            // 异常直接返回
            if (errorCode !== 0) {
                return;
            }
            // 更新状态
            this.setState({
                status: (data as StatusData).plug,
            });
        });
    }

    // --------------------事件处理函数--------------------
    /**
     * 插件启用切换事件
     */
    private handleSwitchEvent(): void {
        const {
            status,
        } = this.state;

        // 获取列表数据
        IndexModel.change('plug', status).then(({ errorCode, data, message }): void => {
            // 异常直接返回
            if (errorCode !== 0) {
                alert(message);
                return;
            }
            // 更新状态
            this.setState({
                status: data as string,
            });
        });
    }
}
