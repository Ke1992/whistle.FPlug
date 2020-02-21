// 样式
import React, {
    Component,
    ReactNode,
} from 'react';
// 样式
require('./Button.scss');
// 定义
interface ButtonProps {
    text: string;
    type?: string;
    handleClickEvent: Function;
}

/**
 * text: 按钮文案
 * type: 按钮类型（jump、search、submit）
 */
export default class Button extends Component<ButtonProps, {}> {
    private static defaultProps = {
        type: 'jump',
    };

    public render(): ReactNode {
        const {
            text,
            type,
            handleClickEvent,
        } = this.props;

        return (
            <button
                onClick={(): void => handleClickEvent()}
                className={['btn', `btn-${type}`].join(' ')}
            >
                {text}
            </button>
        );
    }
}
