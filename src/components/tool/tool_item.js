//组件
import React, {
	Component
} from 'react';
//库
import Url from '../../utils/url';

class Tool extends Component {
	constructor(props) {
		super(props);

		this.state = {
			status: WEBDATA[props.item.key] == 'on' ? 'on' : 'off'
		};

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		const {
			item: {
				key
			}
		} = this.props;
		const status = this.state.status == 'on' ? 'off' : 'on';

		//发起请求
		Url.switchToggleByType(key, status).then(result => {
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

	render() {
		const {
			item: {
				title,
				icon,
				type
			}
		} = this.props;
		const {
			status
		} = this.state;

		return (
			<div className='tool_item'>
				<div onClick={this.handleClick} className={['tool_icon', status].join(' ')}>
					<span class={['icon', 'icon-item', icon].join(' ')}></span>
				</div>
				<div className='tool_tips'>{title}</div>
			</div>
		);
	}
}

export default Tool;