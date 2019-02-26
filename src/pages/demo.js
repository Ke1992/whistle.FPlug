//样式
import style from './demo.scss';
//配置
import ValidConfig from '../../config/valid.config';
//组件
import React, {
	Component
} from 'react';
import ReactDOM from 'react-dom';
import {
	Input,
	AiCheck
} from '../components/keyin/keyin';
import {
	Table,
	Column,
	ColumnCustom
} from '../components/table/table';
import {
	Main,
	Tips,
	Line,
	Mould,
	Dialog,
	Subnav,
	Button,
	Emphasize,
	Container,
	ContainerTop
} from '../components/layout/layout';
//库
import Tool from '../utils/tool';

//校验规则
const {
	rule: Rule
} = ValidConfig;
//其他
const container = document.getElementById('main');

//页面类
class Demo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form: [],
			table: null,
			dialog: null
		};

		this.submit = this.submit.bind(this);
		this.addItemToState = this.addItemToState.bind(this);
		this.initColumnCustom = this.initColumnCustom.bind(this);
	}

	//提交函数
	submit() {
		let msg = '';
		let allValid = true;
		//遍历所有键入组件，校验数据是否有效
		this.state.form.forEach((ceil) => {
			const result = ceil.valid();

			if (allValid && !result.valid) {
				msg = result.msg;
				allValid = false;
			}
		});

		//校验没有通过
		if (!allValid) {
			this.state.dialog.show({
				content: msg
			});
			return;
		}

		//校验通过
		this.state.dialog.show({
			content: '通过校验'
		});
	}

	//将组件添加到State中
	addItemToState(item, type = 'form') {
		if (type == 'form') {
			const {
				form
			} = this.state;

			form.push(item);

			this.setState(state => ({
				form
			}));
		} else if (type == 'table') {
			this.setState(state => ({
				table: item
			}));
		} else if (type == 'dialog') {
			this.setState(state => ({
				dialog: item
			}));
		}
	}

	//初始化自定义单元格
	initColumnCustom() {
		//启动
		return <a href='javascript: ;' className='icon icon-play' title='启动'></a>;
	}

	render() {
		const aiCheckConfig = [{
			text: '选项1',
			value: 1
		}, {
			text: '选项2',
			value: 2
		}, {
			text: '选项3',
			value: 3
		}, {
			text: '选项4',
			value: 4
		}, {
			text: '选项5',
			value: 5
		}];
		const tableData = [];
		for (let i = 0; i < 125; i++) {
			tableData.push({
				index: i + 1,
				time: Tool.formatDate(new Date())
			});
		}
		const iconList = ['icon-eye', 'icon-paper-clip', 'icon-mail', 'icon-toggle', 'icon-layout', 'icon-link', 'icon-bell', 'icon-lock', 'icon-unlock', 'icon-ribbon', 'icon-image', 'icon-signal', 'icon-target', 'icon-clipboard', 'icon-clock', 'icon-watch', 'icon-air-play', 'icon-camera', 'icon-video', 'icon-disc', 'icon-printer', 'icon-monitor', 'icon-server', 'icon-cog', 'icon-heart', 'icon-paragraph', 'icon-align-justify', 'icon-align-left', 'icon-align-center', 'icon-align-right', 'icon-book', 'icon-layers', 'icon-stack', 'icon-stack-2', 'icon-paper', 'icon-paper-stack', 'icon-search', 'icon-zoom-in', 'icon-zoom-out', 'icon-reply', 'icon-circle-plus', 'icon-circle-minus', 'icon-circle-check', 'icon-circle-cross', 'icon-square-plus', 'icon-square-minus', 'icon-square-check', 'icon-square-cross', 'icon-microphone', 'icon-record', 'icon-skip-back', 'icon-rewind', 'icon-play', 'icon-pause', 'icon-stop', 'icon-fast-forward', 'icon-skip-forward', 'icon-shuffle', 'icon-repeat', 'icon-folder', 'icon-umbrella', 'icon-moon', 'icon-thermometer', 'icon-drop', 'icon-sun', 'icon-cloud', 'icon-cloud-upload', 'icon-cloud-download', 'icon-upload', 'icon-download', 'icon-location', 'icon-location-2', 'icon-map', 'icon-battery', 'icon-head', 'icon-briefcase', 'icon-speech-bubble', 'icon-anchor', 'icon-globe', 'icon-box', 'icon-reload', 'icon-share', 'icon-marquee', 'icon-marquee-plus', 'icon-marquee-minus', 'icon-tag', 'icon-power', 'icon-command', 'icon-alt', 'icon-esc', 'icon-bar-graph', 'icon-bar-graph-2', 'icon-pie-graph', 'icon-star', 'icon-arrow-left', 'icon-arrow-right', 'icon-arrow-up', 'icon-arrow-down', 'icon-volume', 'icon-mute', 'icon-content-right', 'icon-content-left', 'icon-grid', 'icon-grid-2', 'icon-columns', 'icon-loader', 'icon-bag', 'icon-ban', 'icon-flag', 'icon-trash', 'icon-expand', 'icon-contract', 'icon-maximize', 'icon-minimize', 'icon-plus', 'icon-minus', 'icon-check', 'icon-cross', 'icon-move', 'icon-delete', 'icon-menu', 'icon-archive', 'icon-inbox', 'icon-outbox', 'icon-file', 'icon-file-add', 'icon-file-subtract', 'icon-help', 'icon-open', 'icon-ellipsis', 'icon-help2', 'icon-spinner10', 'icon-checkmark', 'icon-info-circle', 'icon-chevron-up', 'icon-chevron-down', 'icon-rocket', 'icon-write', 'icon-dot-single', 'icon-square', 'icon-spinner9', 'icon-cogs', 'icon-bug', 'icon-embed2'];

		return (
			<Main>
				<Subnav title='Demo' />

				<Container>
					<Tips title='input组件' desc='校验规则包含：no、http、empty、email、custom、number、english、character' />
					<ContainerTop title='Input组件' />

					<Mould name='不校验：' size='half'>
						<Input id='no'
							name='不校验'
							format={Rule.no}
							init={this.addItemToState}
							placeholder='不进行任何校验'/>
					</Mould>

					<Mould name='不为空：' size='half'>
						<Input id='empty'
							name='不为空'
							init={this.addItemToState}
							placeholder='默认校验空值'/>
					</Mould>

					<Mould name='http校验：' size='half'>
						<Input id='http'
							name='http校验'
							init={this.addItemToState}
							placeholder='校验是否为http链接'/>
					</Mould>

					<Mould name='email校验：' size='half'>
						<Input id='email'
							name='email校验'
							init={this.addItemToState}
							placeholder='校验是否为email'/>
					</Mould>

					<Mould name='number校验：' size='half'>
						<Input id='number'
							name='number校验'
							init={this.addItemToState}
							placeholder='校验是否为数字'/>
					</Mould>

					<Mould name='英文校验：' size='half'>
						<Input id='english'
							name='英文校验'
							init={this.addItemToState}
							placeholder='校验是否为英文字母'/>
					</Mould>

					<Mould name='汉字校验：' size='half'>
						<Input id='character'
							name='汉字校验'
							init={this.addItemToState}
							placeholder='校验是否为汉字'/>
					</Mould>

					<Mould name='自定义校验：' size='half'>
						<Input id='custom'
							name='自定义校验'
							format={Rule.custom}
							init={this.addItemToState}
							regexp='^([0-9]|[A-Za-z]|[\u4e00-\u9fa5]|\_)*$'
							placeholder='最多30个字符，包括汉字、字母、数字、下划线'/>
					</Mould>

					<Mould name='disabled：' size='half'>
						<Input id='disabledInput'
							disabled={true}
							name='disabledInput'
							init={this.addItemToState}
							defaultValue='默认值' />
					</Mould>
				</Container>

				<Container>
					<ContainerTop title='aicheck组件' />

					<Mould name='radio组件：'>
						<AiCheck id='radio'
							name='radio组件'
							defaultValue={[1]}
							data={aiCheckConfig}
							init={this.addItemToState} />
					</Mould>

					<Mould name='checkbox组件：'>
						<AiCheck id='checkbox'
							type='checkbox'
							name='checkbox组件'
							defaultValue={[1, 2]}
							data={aiCheckConfig}
							init={this.addItemToState} />
					</Mould>

					<Mould name='disabled：'>
						<AiCheck id='disabledAiCheck'
							type='checkbox'
							disabled={true}
							name='disabledAiCheck'
							defaultValue={[1, 2]}
							data={aiCheckConfig}
							init={this.addItemToState} />
					</Mould>
				</Container>

				<Container>
					<ContainerTop title='Button组件'>
						<span className='mr-40'></span>
						<Button text='内嵌按钮' type='search' />
					</ContainerTop>

					<Mould type='noname'>
						<Button text='log' type='log' />
						<span className='mr-40'></span>
						<Button text='jump' type='jump' />
						<span className='mr-40'></span>
						<Button text='log-on' type='log-on' />
						<span className='mr-40'></span>
						<Button text='search' type='search' />
					</Mould>
				</Container>

				<div className='mb-40'></div>

				<Table init={item => this.addItemToState(item, 'table')} data={tableData} checkbox={true} limit={10}>
					<Column field='time' text='时间' />
					<Column field='index' text='序号' />
					<ColumnCustom field='handle' text='自定义' init={this.initColumnCustom} />
				</Table>
				
				<div className='mb-40'></div>

				<Container>
					<ContainerTop title='Icon列表' show={false}/>

					<Mould type='noname'>
						{
							iconList.map(item => {
								return <span key={item} className={['icon', 'icon-item', item].join(' ')}></span>
							})
						}
					</Mould>
				</Container>

				<div className='mt-40 text-center'>
					<Button text='提交保存' type='submit' onClick={this.submit}/>
				</div>

				<Dialog init={item => this.addItemToState(item, 'dialog')}/>
			</Main>
		);
	}
}

ReactDOM.render(
	<Demo />,
	container
);