//样式
import style from './invade.scss';
//组件
import React, {
	Component
} from 'react';
import ReactDOM from 'react-dom';
import {
	AiCheck
} from '../components/keyin/keyin';
import {
	Main,
	Mould,
	Subnav,
	Button,
	Container,
	ContainerTop
} from '../components/layout/layout';
//库
import Url from '../utils/url';

let timer = null; //定时器
const container = document.getElementById('main');

//页面类
class Invade extends Component {
	constructor(props) {
		super();
		this.state = {
			type: 'all',
			radio: null,
			table: null,
			logs: WEBDATA.logs
		};

		this.getLogsData = this.getLogsData.bind(this);
		this.changeLogType = this.changeLogType.bind(this);
		this.addItemToState = this.addItemToState.bind(this);
		this.refreshLogData = this.refreshLogData.bind(this);
		this.handleClearEvent = this.handleClearEvent.bind(this);
	}

	//渲染完成生命周期
	componentDidUpdate() {
		//定时获取日志
		this.refreshLogData();
	}

	//获取日志数据
	getLogsData() {
		const result = [];
		const {
			logs,
			type
		} = this.state;

		logs.forEach(item => {
			(type == 'all' || item.type == type) && result.push(item);
		});

		return result;
	}

	//变更日志类型
	changeLogType(param) {
		this.setState(state => ({
			type: param.value
		}));
	}

	//将组件添加到State中
	addItemToState(item, type = 'radio') {
		if (type == 'radio') {
			this.setState(state => ({
				radio: item
			}));
		} else if (type == 'table') {
			this.setState(state => ({
				table: item
			}));
		}
	}

	//刷新日志数据
	refreshLogData() {
		//清除定时器
		clearTimeout(timer);
		//重新设置定时器
		timer = setTimeout(() => {
			//发请求
			Url.getAllLog().then(result => {
				const oldLogLength = this.state.logs.length;
				//设置数据
				this.setState(state => ({
					logs: result.data
				}), () => {
					//长度相等则认为没有新数据
					if (oldLogLength == this.state.logs.length) {
						return;
					}
					//滚动到最底部
					this.refs.invade.scrollTop = this.refs.invade.scrollHeight;
				});
			}).catch(error => {
				console.error(error);
			});
		}, 500);
	}

	//清楚全部日志
	handleClearEvent() {
		Url.clearAllLog().then(result => {
			//设置数据
			this.setState(state => ({
				type: 'all',
				logs: result.data
			}));
			//重置radio
			this.state.radio.reset();
		}).catch(error => {
			alert('清空失败');
			console.error(error);
		});
	}

	render() {
		const logs = this.getLogsData();
		const aiCheckConfig = [{
			text: 'all',
			value: 'all'
		}, {
			text: 'log',
			value: 'log'
		}, {
			text: 'warn',
			value: 'warn'
		}, {
			text: 'error',
			value: 'error'
		}];

		return (
			<Main>
				<Subnav title='Console日志' />

				<Container>
					<ContainerTop title='过滤条件' />

					<Mould name='筛选级别：' size='full'>
						<AiCheck id='type'
							name='筛选'
							shape='circular'
							data={aiCheckConfig}
							defaultValue={['all']}
							init={this.addItemToState}
							checkFunc={this.changeLogType} />
						<span className='mr-40'></span>
						<Button text='清空' type='search' onClick={this.handleClearEvent}/>
					</Mould>
				</Container>

				<div className='invade' contenteditable='true' ref='invade'>
					{
						logs.map((item, index) => {
							return <div key={index} className={['invade_item', item.type].join(' ')}>
								来源：{item.nowurl}<br/>
								序号：{item.serial}<br/>
								内容：{item.content}
							</div>
						})
					}
				</div>
			</Main>
		);
	}
}

ReactDOM.render(
	<Invade />,
	container
);