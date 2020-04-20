// 库
import React, {
    Component,
    ReactNode,
} from 'react';
// 组件
import AiCheckItem from './AiCheckItem';
// 定义
import {
    ValidResult,
    CheckOptions,
} from '../../../shared/interface';
// 样式
require('./AiCheck.scss');
// 定义
interface AiCheckProps {
    name: string;
    options: CheckOptions[];

    skin?: 'fill' | 'empty';
    type?: 'radio' | 'checkbox';
    inner?: 'point' | 'hook' | 'dot';
    shape?: 'square' | 'circular';

    disabled?: boolean;
    defaultValue?: string | string[];

    checkFunc?: Function;
    noCheckFunc?: Function;
}
interface AiCheckState {
    result: string | string[];
}

/**
 * AiCheck组件
 */
export default class AiCheck extends Component<AiCheckProps, AiCheckState> {
    private static defaultProps = {
        data: [] as string[],
        skin: 'fill',
        type: 'radio',
        inner: 'hook',
        shape: 'square',
        disabled: false,
        defaultValue: [] as string[],
        checkFunc(): void {
            // do nothing
        },
        noCheckFunc(): void {
            // do nothing
        },
    };

    public constructor(props: AiCheckProps) {
        super(props);

        this.state = {
            result: props.defaultValue,
        };

        // 绑定函数
        this.valid = this.valid.bind(this);
        this.empty = this.empty.bind(this);
        this.reset = this.reset.bind(this);
        this.getData = this.getData.bind(this);
        this.changeCheckedStatus = this.changeCheckedStatus.bind(this);
    }

    public render(): ReactNode {
        const {
            skin,
            shape,
            inner,
            options,
            disabled,
        } = this.props;
        const {
            result,
        } = this.state;

        return (
            <span className='ai-check-wrap'>
                <span></span>
                {
                    options.map((item, index) => {
                        const {
                            text,
                            value,
                        } = item;

                        return <AiCheckItem key={ index }
                            skin={ skin }
                            text={ text }
                            shape={ shape }
                            inner={ inner }
                            value={ value }
                            disabled={ disabled }
                            checked={ result.indexOf(value) >= 0 }
                            changeCheckedStatus={ this.changeCheckedStatus } />;
                    })
                }
            </span>
        );
    }

    // --------------------数据相关函数--------------------
    /**
     * 校验结果
     */
    valid(): ValidResult {
        const {
            name,
        } = this.props;
        const valid = !!this.state.result.length;

        return {
            valid,
            message: `请选择${name}`,
        };
    }

    /**
     * 清空数据
     */
    empty(): void {
        this.setState({
            result: [],
        });
    }

    /**
     * 重置状态
     */
    reset(): void {
        this.setState({
            result: this.props.defaultValue,
        });
    }

    /**
     * 更新数据
     * @param data [需要更新的数据]
     */
    update(data: string[]): void {
        this.setState({
            result: data,
        });
    }

    /**
     * 获取数据
     */
    getData(): string {
        const {
            type,
        } = this.props;

        if (type === 'radio') {
            return this.state.result[0];
        }

        return this.state.result as string;
    }

    // --------------------事件处理函数--------------------
    /**
     * 改变选中状态
     * @param value
     * @param text
     * @param checked
     */
    changeCheckedStatus(value: string, text: string, checked: boolean): void {
        let {
            result,
        } = this.state;
        const {
            type,
            checkFunc,
            noCheckFunc,
        } = this.props;

        if (type === 'radio') {
            // 清空数据
            result = [];
            // 新增数据
            result.push(value);
        } else if (checked) {
            // 新增数据
            (result as string[]).push(value);
        } else {
            // 移除对应数据
            (result as string[]).splice(result.indexOf(value), 1);
        }

        // 更新组件
        this.setState({
            result,
        }, (): void => {
            const param: CheckOptions = {
                text,
                value,
            };

            if (type === 'radio') {
                // 调用选中事件
                this.props.checkFunc(param);
            } else if (checked) {
                checkFunc(param);
            } else {
                noCheckFunc(param);
            }
        });
    }
}
