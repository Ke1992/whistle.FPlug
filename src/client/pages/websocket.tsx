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
} from '../components/keyin';
import Dialog from '../components/websocket/dialog/Dialog';
// 请求类
import WebSocketModel from '../shared/apis/WebSocketModel';
// 定义
import {
    WebSocketItem,
} from '../shared/interface';
// 样式
require('./websocket.scss');
// 定义
interface WebSocketState {
    loading: boolean;
    list: WebSocketItem[];
}

/**
 * WebSocket页面
 */
class WebSocket extends Component<{}, WebSocketState> {
    private dialog: RefObject<Dialog> = React.createRef();

    public constructor(props: {}) {
        super(props);

        this.state = {
            list: [],
            loading: true,
        };

        // 绑定函数
        this.init = this.init.bind(this);

        this.handleAddEvent = this.handleAddEvent.bind(this);
        this.handleModifyEvent = this.handleModifyEvent.bind(this);
        this.handleDeleteEvent = this.handleDeleteEvent.bind(this);

        // 进行初始化
        this.init();
    }

    public render(): ReactNode {
        const {
            list,
            loading,
        } = this.state;

        return (
            <Container>
                <Subnav title="WebSocket配置" />
                <Button text='新增' type='jump' handleClickEvent={ this.handleAddEvent }/>
                <table cellPadding="0" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>类型</th>
                            <th>映射规则</th>
                            <th>文件路径</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className={['none', loading ? '' : 'hide'].join(' ')}>
                            <td colSpan={ 4 }>数据加载中...</td>
                        </tr>
                        <tr className={['none', loading || list.length ? 'hide' : ''].join(' ')}>
                            <td colSpan={ 4 }>当前暂无配置的规则</td>
                        </tr>
                        {
                            list.map((item, index): ReactNode => {
                                const {
                                    key,
                                    type,
                                    rule,
                                    file,
                                } = item;

                                return (
                                    <tr key={ key }>
                                        <td>{type}</td>
                                        <td>{rule}</td>
                                        <td>{file}</td>
                                        <td>
                                            <span
                                                onClick={(): void => this.handleModifyEvent(index)}
                                            >修改</span>
                                            <span
                                                onClick={(): void => this.handleDeleteEvent(index)}
                                            >删除</span>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                <Dialog ref={ this.dialog } />
            </Container>
        );
    }

    // --------------------状态相关函数--------------------
    /**
     * 初始化
     */
    init(): void {
        // 请求数据
        WebSocketModel.list().then(({ errorCode, data, message }) => {
            if (errorCode !== 0) {
                alert(message);
                return;
            }
            this.setState({
                loading: false,
                list: data as WebSocketItem[],
            });
        });
    }

    // --------------------数据相关函数--------------------
    /**
     * 更新列表
     * @param index [配置项对应的下标值]
     * @param data  [待添加或者更新的数据]
     */
    updateList(type: 'add' | 'modify' | 'delete', index: number, data: WebSocketItem): void {
        const {
            list,
        } = this.state;

        if (type === 'add') {
            // 添加数据
            list.push(data);
        } else if (type === 'modify') {
            // 更新数据
            list[index].type = data.type;
            list[index].rule = data.rule;
            list[index].file = data.file;
        } else if (type === 'delete') {
            // 删除数据
            list.splice(index, 1);
        }
        // 更新数据
        this.setState({
            list,
        });
        // 发送数据到后台
        WebSocketModel.update(list);
    }

    // --------------------事件处理函数--------------------
    /**
     * 新增规则事件
     */
    handleAddEvent(): void {
        this.dialog.current.show({
            confirmFunc: (data: WebSocketItem) => {
                this.updateList('add', -1, data);
            },
        });
    }

    /**
     * 修改事件
     * @param index [配置项对应的下标值]
     */
    handleModifyEvent(index: number): void {
        // 弹框修改配置数据
        this.dialog.current.show({
            ...this.state.list[index],
            confirmFunc: (data: WebSocketItem) => {
                this.updateList('modify', index, data);
            },
        });
    }

    /**
     * 删除事件
     * @param index [配置项对应的下标值]
     */
    handleDeleteEvent(index: number): void {
        this.updateList('delete', index, null);
    }
}

// 渲染页面
ReactDOM.render(
    <WebSocket></WebSocket>,
    document.getElementById('app'),
);
