// 样式
import React, {
    Component,
    ReactNode,
} from 'react';
// 常量
import {
    ToolList,
} from '../../../config/base-config';
// 定义
import {
    StatusData,
} from '../../../shared/interface';
// 样式
require('./Tool.scss');
// 定义
interface ToolProps {
    status: StatusData;
    handleSwitchEvent: Function;
}

export default class Tool extends Component<ToolProps, {}> {
    public render(): ReactNode {
        const {
            status,
            handleSwitchEvent,
        } = this.props;

        return (
            <div className='tool'>
                {
                    ToolList.map((item) => {
                        const {
                            key,
                            icon,
                            title,
                        } = item;

                        return (
                            <div key={key} className='tool_item'>
                                <div onClick={(): void => handleSwitchEvent(key)} className={['tool_icon', status[key]].join(' ')}>
                                    <span className={['icon', 'icon-item', icon].join(' ')}></span>
                                </div>
                                <div className='tool_tips'>{title}</div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}
