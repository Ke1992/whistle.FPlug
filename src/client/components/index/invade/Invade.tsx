// 样式
import React, {
    Component,
    ReactNode,
    RefObject,
} from 'react';
// 组件
import {
    Button,
    Textarea,
} from '../../keyin';
// 请求类
import IndexModel from '../../../shared/apis/IndexModel';
// 定义
import {
    StatusData,
} from '../../../shared/interface';
// 样式
require('./Invade.scss');
// 定义
interface InvadeProps {
    status: StatusData;
    handleSwitchEvent: Function;
}
// 常量
const INVADE_KEY = 'invade';

export default class Invade extends Component<InvadeProps, {}> {
    private textarea: RefObject<Textarea> = React.createRef();

    public constructor(props: InvadeProps) {
        super(props);

        // 绑定函数
        this.handleInvadeEvent = this.handleInvadeEvent.bind(this);
    }

    public render(): ReactNode {
        const {
            status,
            handleSwitchEvent,
        } = this.props;

        return (
            <div className='invade'>
                <div className={['invade_icon', status[INVADE_KEY]].join(' ')} onClick={(): void => handleSwitchEvent('invade')}>
                    <span className="icon icon-item icon-embed2"></span>
                </div>
                <div className='invade_title'>JS注入</div>
                <div className='invade_input'>
                    <Textarea
                        name='JS脚本'
                        ref={ this.textarea }
                        placeholder='需要注入的JS脚本'
                    />
                </div>
                <div className='invade_btn'>
                    <Button
                        text='发送'
                        handleClickEvent={(): void => this.handleInvadeEvent()}
                    />
                </div>
            </div>
        );
    }

    // --------------------事件处理函数--------------------
    /**
     * 插件启用切换事件
     */
    private handleInvadeEvent(): void {
        const {
            valid,
            message,
        } = this.textarea.current.valid();

        // 没有启用工具
        if (this.props.status[INVADE_KEY] !== 'on') {
            alert('请先启用JS注入工具');
            return;
        }

        // 没有通过校验
        if (!valid) {
            alert(message);
            return;
        }

        // 获取脚本数据
        const script = this.textarea.current.getData();
        // 发起请求
        IndexModel.save(script).then(({ errorCode }) => {
            // 异常直接返回
            if (errorCode !== 0) {
                alert('发送失败');
                return;
            }
            alert('发送成功');
            // 清空数据
            this.textarea.current.empty();
        });
    }
}
