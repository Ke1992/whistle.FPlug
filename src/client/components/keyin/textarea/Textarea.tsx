// 样式
import React, {
    Component,
    ReactNode,
} from 'react';
// 定义
import {
    ValidResult,
} from '../../../shared/interface';
// 样式
require('./Textarea.scss');
// 定义
interface TextareaProps {
    name: string;
    disabled?: boolean;
    placeholder: string;
    defaultValue?: string;
}
interface TextareaState {
    value: string;
    error: boolean;
}

/**
 * name
 * disabled:        是否禁止
 * placeholder:     提示语
 * defaultValue:    默认值
 */
export default class Textarea extends Component<TextareaProps, TextareaState> {
    private static defaultProps = {
        disabled: false,
        defaultValue: '',
    };

    public constructor(props: TextareaProps) {
        super(props);

        this.state = {
            value: props.defaultValue,
            error: false,
        };

        // 绑定函数
        this.empty = this.empty.bind(this);

        this.getData = this.getData.bind(this);
    }

    public render(): ReactNode {
        const {
            disabled,
            placeholder,
        } = this.props;
        const {
            value,
            error,
        } = this.state;

        return (
            <textarea
                value={ value }
                disabled={ disabled }
                placeholder={ placeholder }
                className={ error ? 'error' : '' }
                onChange={(event): void => this.handleChangeEvent(event)}>
            </textarea>
        );
    }

    // 获取数据函数
    public getData(): string {
        return this.state.value;
    }

    // 清空数据
    public empty(): void {
        this.setState({
            value: '',
        });
    }

    // 校验函数
    public valid(): ValidResult {
        const {
            name,
            disabled,
        } = this.props;
        const {
            value,
        } = this.state;

        // 禁止状态 && 有默认值
        if (disabled && value) {
            return {
                valid: true,
                message: '',
            };
        }

        // 获取结果
        const valid = !!value;

        // 重置输入框error状态
        this.setState({
            error: !valid,
        });

        return {
            valid,
            message: `${name}不能为空`,
        };
    }

    // --------------------事件处理函数--------------------
    /**
     * 监听键盘输入
     */
    private handleChangeEvent(event: React.ChangeEvent): void {
        const {
            value,
        } = event.target as HTMLInputElement;

        this.setState({
            value,
        });
    }
}
