//样式
import style from './index.scss';
//配置
import Config from '../../config/common.config';
//组件
import React, {
	Component
} from 'react';
import ReactDOM from 'react-dom';
import {
	Textarea
} from '../components/keyin/keyin';
import {
	Main,
	Subnav,
	Button
} from '../components/layout/layout';
import Tool from '../components/tool/tool';
//库
import Url from '../utils/url';

//其他
const statusKey = 'invade';
const container = document.getElementById('main');

//页面类对象
class Index extends Component {
	constructor(props) {
		super();
		this.state = {
			form: [],
			status: WEBDATA[statusKey] == 'on' ? 'on' : 'off'
		};

		this.addItemToState = this.addItemToState.bind(this);
		this.handleIconClick = this.handleIconClick.bind(this);
		this.handleInvadeClick = this.handleInvadeClick.bind(this);
	}

	//将组件添加到State中
	addItemToState(item) {
		const {
			form
		} = this.state;

		form.push(item);

		this.setState(state => ({
			form
		}));
	}

	//处理icon的点击事件
	handleIconClick() {
		const status = this.state.status == 'on' ? 'off' : 'on';

		//发起请求
		Url.switchToggleByType(statusKey, status).then(result => {
			//包含敏感操作命令
			if (result.code == 0) {
				//设置数据
				this.setState(state => ({
					status
				}));
			} else {
				alert(result.msg);
			}
		}).catch(error => {
			alert('切换失败');
			console.error(error);
		});
	}

	//处理JS注入的点击事件
	handleInvadeClick() {
		const data = this.state.form[0].getData().value;
		const item = this.state.form[0].valid();

		//没有通过校验
		if (!item.valid) {
			alert(item.msg);
			return;
		}
		//发起请求
		Url.sendScriptToCache(data).then(result => {
			if (result.code == 0) {
				alert('发送成功');
				//清空数据
				this.state.form[0].empty();
			} else {
				alert('发送失败');
			}
		}).catch(error => {
			alert('发送失败');
			console.error(error);
		});
	}

	render() {
		const {
			status
		} = this.state;

		return (
			<Main>
				<Subnav title='工具库' />
				<div className='pt-60'></div>
				<Tool config={Config} />
				<div className='invade'>
					<div className={['invade_icon', status].join(' ')} onClick={this.handleIconClick}>
						<span class="icon icon-item icon-embed2"></span>
					</div>
					<div className='invade_title'>
						JS注入
					</div>
					<div className='invade_input'>
						<Textarea id='invade'
							name='JS脚本'
							init={this.addItemToState}
							placeholder='需要注入的JS脚本'/>
					</div>
					<div className='invade_btn'>
						<Button text='发送' type='search' onClick={()=>this.handleInvadeClick()}/>
					</div>
				</div>
			</Main>
		);
	}
}

ReactDOM.render(
	<Index />,
	container
);