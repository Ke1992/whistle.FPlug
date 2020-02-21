// 样式
import React, {
    Component,
    ReactNode,
} from 'react';
// 样式
require('./Subnav.scss');
// 定义
interface SubnavProps {
    title: string;
}

export default class Subnav extends Component<SubnavProps, {}> {
    public render(): ReactNode {
        const {
            title,
        } = this.props;

        return (
            <div className='subnav'>
                <h1>{title}</h1>
            </div>
        );
    }
}
