// 样式
import React, {
    Component,
    ReactNode,
} from 'react';
// 常量
import {
    FooterList,
} from '../../../config/base-config';
// 样式
require('./Footer.scss');

export default class Footer extends Component<{}, {}> {
    public render(): ReactNode {
        return (
            <div className="footer">
                <p>
                    {
                        FooterList.map((item, index) => {
                            const {
                                url,
                                name,
                            } = item;

                            return (
                                <a key={index} className="link" href={url} target="view_window">{name}</a>
                            );
                        })
                    }
                </p>
            </div>
        );
    }
}
