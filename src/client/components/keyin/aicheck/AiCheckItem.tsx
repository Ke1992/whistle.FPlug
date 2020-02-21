// 库
import React, {
    Component,
    ReactNode,
} from 'react';
// 样式
require('./AiCheckItem.scss');
// 定义
interface AiCheckItemProps {
    text: string;
    value: string;

    skin: string;
    inner: string;
    shape: string;
    checked: boolean;
    disabled: boolean;

    changeCheckedStatus: Function;
}

/**
 * AiCheckItem组件
 */
export default class AiCheckItem extends Component<AiCheckItemProps, {}> {
    public constructor(props: AiCheckItemProps) {
        super(props);

        // 绑定函数
        this.handleClickEvent = this.handleClickEvent.bind(this);
    }

    public render(): ReactNode {
        const {
            text,
            skin,
            shape,
            inner,
            checked,
            disabled,
        } = this.props;


        return (
            <span className={['ai-check-span', disabled ? 'disabled' : ''].join(' ')}>
                <i className={[shape, checked ? inner : '', checked ? skin : ''].join(' ')} onClick={this.handleClickEvent}></i>
                <span>{text}</span>
            </span>
        );
    }

    // --------------------事件处理函数--------------------
    /**
     * 点击事件
     */
    handleClickEvent(): void {
        const {
            text,
            value,
            checked,
            disabled,
            changeCheckedStatus,
        } = this.props;

        if (disabled) {
            return;
        }

        // 调用父组件
        changeCheckedStatus(value, text, !checked);
    }
}
