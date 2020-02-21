// 库
import React, {
    Component,
    ReactNode,
    RefObject,
} from 'react';
import ReactDOM from 'react-dom';
// 组件
import {
    Subnav,
    Container,
} from '../components/common';
import {
    Button,
    AiCheck,
} from '../components/keyin';
// 请求类
import IndexModel from '../shared/apis/IndexModel';
// 定义
import {
    LogItem,
    CheckOptions,
} from '../shared/interface';
// 样式
require('./invade.scss');
// 定义
interface InvadeState {
    type: string;
    logs: LogItem[];
}
// 常量
const AI_CHECK_OPTIONS = [{
    text: 'all',
    value: 'all',
}, {
    text: 'log',
    value: 'log',
}, {
    text: 'warn',
    value: 'warn',
}, {
    text: 'error',
    value: 'error',
}];

/**
 * Invade页面
 */
class Invade extends Component<{}, InvadeState> {
    private aicheck: RefObject<AiCheck> = React.createRef();

    private invade: RefObject<HTMLDivElement> = React.createRef();

    public constructor(props: {}) {
        super(props);

        this.state = {
            logs: [],
            type: 'all',
        };

        // 绑定函数
        this.init = this.init.bind(this);
        this.getLogs = this.getLogs.bind(this);
        this.filterLogsByType = this.filterLogsByType.bind(this);

        this.handleCheckEvent = this.handleCheckEvent.bind(this);
        this.handleClearEvent = this.handleClearEvent.bind(this);

        // 进行初始化
        this.init();
    }

    public render(): ReactNode {
        // 根据筛选类别过滤日志
        const list = this.filterLogsByType();

        return (
            <Container>
                <Subnav title="Console日志" />
                <div className='container'>
                    <div className="name">筛选级别：</div>
                    <div>
                        <AiCheck
                            name='筛选'
                            shape='circular'
                            ref={ this.aicheck }
                            defaultValue={ ['all'] }
                            options={ AI_CHECK_OPTIONS }
                            checkFunc={ this.handleCheckEvent } />
                        <span className="spacing"></span>
                        <Button text='清空' type='search' handleClickEvent={ this.handleClearEvent }/>
                    </div>
                </div>
                <div
                    className='invade'
                    contentEditable='true'
                    ref={ this.invade }
                >
                    {
                        list.map((item, index) => {
                            const {
                                type,
                                nowurl,
                                serial,
                                content,
                            } = item;

                            return (
                                <div key={index} className={['invade_item', type].join(' ')}>
                                    来源：{nowurl}<br/>
                                    序号：{serial}<br/>
                                    内容：{content}
                                </div>
                            );
                        })
                    }
                </div>
            </Container>
        );
    }

    // --------------------状态相关函数--------------------
    /**
     * 初始化
     */
    init(): void {
        // 先请求一次
        this.getLogs();
        // 然后每隔200ms请求一次
        setInterval(() => {
            this.getLogs();
        }, 400);
    }

    // --------------------数据相关函数--------------------
    /**
     * 获取最新的console日志
     */
    getLogs(): void {
        IndexModel.list().then(({ errorCode, data }) => {
            // 返回码不等于0，直接返回
            if (errorCode !== 0) {
                return;
            }
            // 日志长度是否有变化
            const isNoChange = (data as LogItem[]).length === this.state.logs.length;
            // 更新数据
            this.setState({
                logs: data as LogItem[],
            }, () => {
                if (isNoChange) {
                    return;
                }
                this.invade.current.scrollTop = this.invade.current.scrollHeight;
            });
        });
    }

    /**
     * 根据筛选类别过滤日志
     */
    filterLogsByType(): LogItem[] {
        const result: LogItem[] = [];
        const {
            logs,
            type,
        } = this.state;

        logs.forEach((item) => {
            (type === 'all' || item.type === type) && result.push(item);
        });

        return result;
    }

    // --------------------事件处理函数--------------------
    /**
     * 选项切换事件
     * @param param [切换选项的结果]
     */
    handleCheckEvent(param: CheckOptions): void {
        const {
            value,
        } = param;

        this.setState({
            type: value,
        });
    }

    /**
     * 清空日志事件
     */
    handleClearEvent(): void {
        IndexModel.clear().then(({ errorCode, data, message }) => {
            if (errorCode !== 0) {
                alert(message);
                return;
            }
            // 设置数据
            this.setState({
                type: 'all',
                logs: data as LogItem[],
            });
            // 重置radio
            this.aicheck.current.reset();
        });
    }
}

// 渲染页面
ReactDOM.render(
    <Invade></Invade>,
    document.getElementById('app'),
);
