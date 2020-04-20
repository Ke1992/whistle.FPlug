// 库
import React, {
    Component,
    ReactNode,
    RefObject,
} from 'react';
import * as _ from 'lodash';
// 组件
import {
    Button,
    AiCheck,
} from '../../keyin';
// 定义
import {
    DialogParam,
    WebSocketItem,
} from '../../../shared/interface';
// 样式
require('./Dialog.scss');
// 定义
interface DialogState {
    key: string;
    rule: string;
    file: string;
    show: boolean;
    confirmFunc: Function;
}
// 常量
const AI_CHECK_OPTIONS = [{
    text: 'Client',
    value: 'Client',
}, {
    text: 'Server',
    value: 'Server',
}];

export default class Dialog extends Component<{}, DialogState> {
    private aicheck: RefObject<AiCheck> = React.createRef();

    public constructor(props: {}) {
        super(props);

        this.state = {
            key: '',
            rule: '',
            file: '',
            show: false,
            confirmFunc: (): void => {
                // do nothing
            },
        };

        // 绑定函数
        this.handleConfirmEvent = this.handleConfirmEvent.bind(this);
        this.handleCancelEvent = this.handleCancelEvent.bind(this);
    }

    public render(): ReactNode {
        const {
            rule,
            file,
            show,
        } = this.state;

        return (
            <div className={['dialog', show ? '' : 'hide'].join(' ')}>
                <div className="content">
                    <div className="title">文件映射</div>
                    <div className="row">
                        <span>类型: </span>
                        <div>
                            <AiCheck
                                name='类型'
                                shape='circular'
                                ref={ this.aicheck }
                                defaultValue={ ['Client'] }
                                options={ AI_CHECK_OPTIONS } />
                        </div>
                    </div>
                    <div className="row">
                        <span>映射规则: </span>
                        <input
                            type="text"
                            value={ rule }
                            onChange={(event): void => this.handleChangeEvent(event, 'rule')}
                        />
                    </div>
                    <div className="row">
                        <span>文件路径: </span>
                        <input
                            type="text"
                            value={ file }
                            onChange={(event): void => this.handleChangeEvent(event, 'file')}
                        />
                    </div>
                    <Button text='取消' type='cancel' handleClickEvent={ this.handleCancelEvent }/>
                    <Button text='确定' type='jump' handleClickEvent={ this.handleConfirmEvent }/>
                </div>
            </div>
        );
    }

    // --------------------页面更新函数--------------------
    /**
     * 显示配置弹框
     * @param param [配置相关参数]
     */
    public show(param: DialogParam): void {
        if (_.isEmpty(param.key)) {
            this.aicheck.current.reset();
        } else {
            this.aicheck.current.update([param.type]);
        }
        // 显示弹框
        this.setState({
            show: true,
            ...({
                rule: '',
                file: '',
                type: 'Client',
                key: `${new Date().getTime()}_${Math.floor(Math.random() * 10)}`,
                confirmFunc: (): void => {
                    // do nothing
                },
                ...param,
            }),
        });
    }

    // --------------------数据相关函数--------------------
    /**
     * 获取数据
     */
    private getData(): WebSocketItem {
        const {
            key,
            rule,
            file,
        } = this.state;

        return {
            key,
            rule,
            file,
            type: this.aicheck.current.getData() as ('Server' | 'Client'),
        };
    }

    // --------------------事件处理函数--------------------
    /**
     * 确认按钮事件
     */
    private handleConfirmEvent(): void {
        const data = this.getData();
        // 更新页面状态
        this.setState({
            show: false,
        });
        // 执行回调
        this.state.confirmFunc(data);
    }

    /**
     * 确认按钮事件
     */
    private handleCancelEvent(): void {
        // 更新页面状态
        this.setState({
            show: false,
        });
    }

    /**
    * 监听键盘输入
    */
    private handleChangeEvent(event: React.ChangeEvent, type: 'rule' | 'file'): void {
        const {
            value,
        } = event.target as HTMLInputElement;

        if (type === 'rule') {
            this.setState({
                rule: value,
            });
        } else if (type === 'file') {
            this.setState({
                file: value,
            });
        }
    }
}
