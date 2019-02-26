//样式
import style from './dialog.scss';
//组件
import React, {
	Component
} from 'react';

//常量
const original = {
	content: '',
	type: 'alert',
	confirm: {
		text: '确定',
		func: () => {}
	},
	cancel: {
		text: '取消',
		func: () => {}
	}
};

/**
 * content			弹框文案
 * type 			弹框类型: alert、confirm
 * confirm 			确认按钮
 * 		text 		确认按钮文案
 * 		func 		确认按钮回调函数
 * cancel 			取消按钮
 * 		text 		取消按钮文案
 * 		func 		取消按钮回调函数
 * callback			按钮回调函数(一定会执行,优先级最低)
 */
class Dialog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			show: false,
			...original
		};

		this.show = this.show.bind(this);
		this.handleCancelFunc = this.handleCancelFunc.bind(this);
		this.handleConfirmFunc = this.handleConfirmFunc.bind(this);
	}

	//render之前的钩子函数
	componentWillMount() {
		this.props.init(this);
	}

	//显示弹框
	show(config) {
		const result = Object.assign({
			content: '',
			type: 'alert',
			confirm: {
				text: '确定',
				func: () => {}
			},
			cancel: {
				text: '取消',
				func: () => {}
			}
		}, config);

		//强制设置show为true
		result.show = true;

		//更新状态
		this.setState(state => result);
	}

	//处理确定按钮事件
	handleConfirmFunc() {
		this.state.confirm.func();
		//更新状态
		this.setState(state => ({
			show: false
		}));
	}

	//处理取消按钮事件
	handleCancelFunc() {
		this.state.cancel.func();
		//更新状态
		this.setState(state => ({
			show: false
		}));
	}

	render() {
		const {
			type,
			show,
			content,
			confirm: {
				text: confirmText
			},
			cancel: {
				text: cancelText
			}
		} = this.state;

		return (
			<div className={['ai-dialog', show ? '' : 'hide'].join(' ')}>
				<div className='ai-dialog-bg'></div>
				<table className='ai-dialog-table'>
					<tbody>
						<tr>
							<td>
								<div className='content'>
									<h2>{content}</h2>
									<div className='btnwrap'>
										<button className='confirm' onClick={this.handleConfirmFunc}>{confirmText || '确定'}</button>
										{type == 'confirm' && <button className='cancel' onClick={this.handleCancelFunc}>{cancelText || '取消'}</button>}
									</div>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

export default Dialog;