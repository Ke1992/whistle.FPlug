// 样式
import React, {
    Component,
    ReactNode,
} from 'react';
// 常量
import {
    MenuList,
} from '../../../config/base-config';
// 样式
require('./SideBarList.scss');

export default class SideBarList extends Component<{}, {}> {
    public render(): ReactNode {
        return (
            <ul>
                {
                    MenuList.map((item, index) => {
                        const {
                            url,
                            icon,
                            title,
                        } = item;

                        return (
                            <li key={index}>
                                <span className='ellipsis'><i></i><i></i><i></i></span>
                                <a href={url} title={title}>
                                    <span className={['icon', icon].join(' ')}></span>
                                    <span className='title'>{title}</span>
                                </a>
                            </li>
                        );
                    })
                }
            </ul>
        );
    }
}
